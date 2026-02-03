from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
import base64

# Import Service Clients
from services.safecore_client import SafeCoreClient
from services.datacore_client import DataCoreClient
from services.biocore_client import BioCoreClient

# Import SDK/Internal logic
from safecore_sdk.middleware import PhoenixDecryptionMiddleware
from safecore_sdk.compliance import ComplianceValidator
from safecore_sdk.encryption import SafeEncryption
from backend.wound_analysis import WoundAnalyzer
from backend.proposal_generator import ProposalGenerator

app = FastAPI(title="Phoenix Core API")

# Initialize Generator
proposal_gen = ProposalGenerator()

LOGOS_URL = os.getenv("LOGOS_URL", "http://localhost:8083")


async def report_to_logos(event_type: str, data: dict):
    """
    3rd Gen Operational Directive: Direct reporting to Logos for Learning.
    """
    print(f"[PHOENIX] Reporting clinical event '{event_type}' to Logos...")
    async with httpx.AsyncClient() as client:
        try:
            payload = {
                "decision": f"PHOENIX_CLINICAL_{event_type.upper()}",
                "context": data
            }
            # Report to Tutor for explanation
            await client.post(f"{LOGOS_URL}/tutor/explain", json=payload)
            # Report to Federated Memory for learning
            await client.post(f"{LOGOS_URL}/memory/federated/ingest", json={"source": "Phoenix", "event": event_type, "data": data})
        except Exception as e:
            print(f"![PHOENIX] Failed to report to Logos: {e}")

# Setup Middlewares
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(PhoenixDecryptionMiddleware)

# Initialize Clients
safecore = SafeCoreClient()
datacore = DataCoreClient()
biocore = BioCoreClient()

# Serve static files from the build directory (for local dev/production)
if os.path.exists("dist/assets"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
elif os.path.exists("dist"):
    # If dist exists but not dist/assets, check if files are directly in dist
    app.mount("/assets", StaticFiles(directory="dist"), name="assets")
else:
    print("WARNING: dist directory not found. Static files will not be served.")

@app.get("/", include_in_schema=False)
async def serve_frontend():
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")
    return {"message": "Phoenix Core API is running", "connections": "SafeCore, DataCore, BioCore INTEGRATED"}

# Configuration
DB_FILE = "local_db.json"
GATEWAY_URL = os.environ.get("GATEWAY_URL", "http://localhost:4000/v1/copilot/invoke")

def get_db():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

class Patient(BaseModel):
    id: str
    nombreCompleto: str
    tipoDocumento: str
    documento: str
    fechaNacimiento: str
    genero: str
    direccion: str
    telefonoMovil: str
    correoElectronico: str
    eps: str
    programa: str
    estado: str
    prioridad: str
    fechaIngreso: str

class ClinicalRecord(BaseModel):
    patient_id: str
    wound_location: str = "Primary"
    wound_status: str
    compliance: str = "HIPAA_REGULATED"
    resvech_score: int = 0
    timers_phase: str = "T"

class ImageArchive(BaseModel):
    patient_id: str
    wound_location: str
    image_b64: str
    timestamp: str = None

class BiometricAuthRequest(BaseModel):
    userId: str
    biometricData: str
    liveness: bool = True

@app.get("/api/compliance")
async def compliance():
    validator = ComplianceValidator()
    result = validator.validate()
    return {
        **result,
        "system_state": "NORMAL",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/patients", response_model=List[Patient])
async def get_patients():
    db = get_db()
    # Simplified: convert local db to list of Patient models
    patients = []
    for pid, data in db.items():
        if 'nombreCompleto' in data:
            patients.append(data)
    return patients

@app.post("/api/records")
async def add_record(request: Request, record: ClinicalRecord = None):
    try:
        data = getattr(request.state, 'decrypted_body', None)
        if not data:
            if not record:
                raise HTTPException(status_code=400, detail="Missing record data")
            data = record.dict()

        db = get_db()
        patient_id = data.get('patient_id')
        db[patient_id] = {
            'nombre': f'Paciente {patient_id}',
            'diagnostico': data.get('wound_status'),
            'fecha': datetime.now().isoformat(),
            'compliance': data.get('compliance', 'HIPAA_REGULATED'),
            'provider': 'DANIEL_AI',
            'secure_transit': getattr(request.state, 'is_encrypted', False)
        }
        save_db(db)
        
        # Also persist to DataCore if possible
        try:
            await datacore.ingest_clinical_data(patient_id, db[patient_id])
        except:
            pass

        return {"message": "Registro guardado de forma segura.", "id": patient_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/diagnose")
async def diagnose_wound(request: Request):
    """
    Station-3 Diagnostic Endpoint: Wound Clinic AI analysis.
    Now leverages Med-Gemma for high-urgency cases.
    """
    try:
        try:
            data = getattr(request.state, 'decrypted_body', None) or await request.json()
        except:
            data = {}
        
        if data is None: data = {}
        
        tissue_type = data.get('tissue_type', 'GRANULATION')
        patient_id = data.get('patient_id', 'P-UNKNOWN')
        wound_location = data.get('wound_location', 'Primary')
        resvech_params = data.get('resvech_params', None)
        
        # Run Advanced Clinical Engine (TIMERS + RESVECH)
        result = WoundAnalyzer.analyze_clinical(tissue_type, resvech_params)
        result['wound_location'] = wound_location

        # --- SIRIUS AUDIT LAYER ---
        async with httpx.AsyncClient() as client:
            sirius_req = {
                "type": "audit_compliance",
                "app": "phoenix",
                "data": {
                    "clinical_decision": result,
                    "compliance_level": "L3"
                }
            }
            try:
                sirius_resp = await client.post(GATEWAY_URL, json=sirius_req, timeout=5.0)
                result['sirius_compliance'] = sirius_resp.json() if sirius_resp.status_code == 200 else {"status": "AUDIT_PENDING"}
            except:
                result['sirius_compliance'] = {"status": "OFFLINE_VALIDATION"}
        
        # If High Urgency or Critical Score, escalate to Med-Gemma
        resvech_data = result.get('resvech_assessment') or {}
        is_critical = resvech_data.get('prognosis') == 'CRITICAL'
        if result.get('urgency_level') == 'HIGH' or is_critical:
            async with httpx.AsyncClient() as client:
                score = resvech_data.get('total_score', 'N/A')
                med_gemma_req = {
                    "type": "medication_check",
                    "app": "phoenix",
                    "priority": "CRITICAL",
                    "data": {
                        "patientHistory": f"Wound Location: {wound_location}. Diagnosis: {result['diagnostics']}. RESVECH Score: {score}",
                        "newPrescription": {"recommendation": result['recommendation']},
                        "medications": []
                    }
                }
                try:
                    resp = await client.post(GATEWAY_URL, json=med_gemma_req, timeout=10.0)
                    if resp.status_code == 200:
                        med_result = resp.json()
                        result['med_gemma_intelligence'] = med_result
                        result['engine'] = 'DANIEL_AI_ADVANCED_CLINICAL'
                except Exception as e:
                    print(f"Error calling Med-Gemma via Gateway: {e}")

        # Sync with local DB and VEGA CORE
        db = get_db()
        record_id = f"{patient_id}_{wound_location.replace(' ', '_')}"
        record_data = {
            **result,
            'patient_id': patient_id,
            'wound_location': wound_location,
            'scale': 'VEGA',
            'resvech': result.get('resvech_assessment'),
            'provider': 'DANIEL_AI_PHOENIX_PRO'
        }
        db[record_id] = record_data
        save_db(db)

        # Shadow-sync to Vega via Gateway
        async with httpx.AsyncClient() as client:
            vega_req = {
                "type": "data_persistence",
                "app": "phoenix",
                "data": record_data
            }
            try:
                await client.post(GATEWAY_URL, json=vega_req, timeout=5.0)
            except:
                pass 

        return {
            "success": True,
            "patient_id": patient_id,
            "diagnostic": result
        }
    except Exception as e:
        print(f"ERROR in diagnose_wound: {e}", flush=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/archive-image")
async def archive_image(archive: ImageArchive):
    """
    HIPAA-compliant image archiving with AES-256-GCM.
    """
    encryption = SafeEncryption()
    
    payload = {
        "patient_id": archive.patient_id,
        "wound_location": archive.wound_location,
        "image_b64": archive.image_b64,
        "timestamp": datetime.now().isoformat()
    }
    
    encrypted_data = encryption.encrypt(payload)
    
    archive_dir = "archive"
    if not os.path.exists(archive_dir):
        os.makedirs(archive_dir)
        
    filename = f"{archive.patient_id}_{archive.wound_location.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.enc"
    with open(os.path.join(archive_dir, filename), "w") as f:
        json.dump(encrypted_data, f)
        
    return {"success": True, "archive_id": filename, "status": "HIPAA_ENCRYPTED"}

@app.post("/api/compare-healing")
async def compare_healing(request: Request):
    """
    Longitudinal comparison using Project Astra.
    """
    data = await request.json()
    patient_id = data.get('patient_id')
    wound_location = data.get('wound_location')
    current_image_b64 = data.get('image_b64')
    
    archive_dir = "archive"
    if not os.path.exists(archive_dir):
        return {"success": False, "error": "No archive found"}
        
    files = sorted([f for f in os.listdir(archive_dir) if f.startswith(f"{patient_id}_{wound_location.replace(' ', '_')}")])
    if not files:
        return {"success": False, "error": "No previous records for this wound location"}
        
    latest_prev = files[-1]
    with open(os.path.join(archive_dir, latest_prev), "r") as f:
        encrypted_prev = json.load(f)
        
    encryption = SafeEncryption()
    prev_data = encryption.decrypt(encrypted_prev)
    prev_image_b64 = prev_data['image_b64']
    
    async with httpx.AsyncClient() as client:
        astra_req = {
            "type": "multimodal_comparison",
            "app": "phoenix",
            "data": {
                "current_image": current_image_b64,
                "previous_image": prev_image_b64,
                "prompt": f"Compare these two images of a wound at '{wound_location}'. Calculate healing percentage and tissue changes."
            }
        }
        try:
            resp = await client.post(GATEWAY_URL, json=astra_req, timeout=15.0)
            return resp.json()
        except Exception as e:
            return {"success": False, "error": f"Astra Comparison Failed: {str(e)}"}

@app.get("/api/records/{patient_id}")
async def get_record(patient_id: str):
    db = get_db()
    if patient_id in db:
        return db[patient_id]
    raise HTTPException(status_code=404, detail="Paciente no encontrado")

# --- New Technology Proposal Tool ---

class TechProposalRequest(BaseModel):
    tech_name: str
    tech_function: str
    category: str = "Medical Device"
    efficiency_kpis: dict = {}
    cost_offsets: dict = {}
    safety: dict = {}
    costs: dict = {}

@app.post("/api/admin/generate-proposal")
async def generate_proposal(request: TechProposalRequest):
    """
    Generates a formal Technology Request Proposal based on Health Economics data.
    Role: Health Economics Analyst.
    """
    result = await proposal_gen.generate(request.dict())
    if not result["success"]:
        # We allow it to return error info but with 500 status if it was a crash, 
        # or 503 if gateway is down. For now generic 500:
        if "Gateway unavailable" in result.get("fallback_msg", ""):
            raise HTTPException(status_code=503, detail=result["fallback_msg"])
        raise HTTPException(status_code=500, detail=result.get("error", "Unknown generation error"))
    
    return result

if __name__ == "__main__":

    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
