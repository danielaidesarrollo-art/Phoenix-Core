
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import json
from safecore_sdk.middleware import PhoenixDecryptionMiddleware
from safecore_sdk.compliance import ComplianceValidator
from safecore_sdk.encryption import SafeEncryption
from datetime import datetime
from backend.wound_analysis import WoundAnalyzer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
import base64

app = FastAPI(title="Phoenix Core API")
app.add_middleware(PhoenixDecryptionMiddleware)

# Serve static files from the build directory
if os.path.exists("dist/assets"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
else:
    print("WARNING: dist/assets directory not found. Static files will not be served.")

@app.get("/", include_in_schema=False)
async def serve_frontend():
    return FileResponse("dist/index.html")

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

@app.get("/")
async def root():
    return {"status": "Phoenix Core Online (Secure Ecosystem)", "core": "Vega", "provider": "DANIEL_AI"}

@app.get("/api/compliance")
async def compliance():
    validator = ComplianceValidator()
    result = validator.validate()
    return {
        **result,
        "system_state": "NORMAL",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/records")
async def add_record(request: Request, record: ClinicalRecord = None):
    try:
        # Check if we have a decrypted body from middleware
        data = getattr(request.state, 'decrypted_body', None)
        
        # Fallback if not encrypted (though restricted by middleware in production)
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
        # Check for encrypted payload from Polaris/Sirius flow
        data = getattr(request.state, 'decrypted_body', None) or await request.json()
        
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
        is_critical = result.get('resvech_assessment', {}).get('prognosis') == 'CRITICAL'
        if result.get('urgency_level') == 'HIGH' or is_critical:
            async with httpx.AsyncClient() as client:
                med_gemma_req = {
                    "type": "medication_check",
                    "app": "phoenix",
                    "priority": "CRITICAL",
                    "data": {
                        "patientHistory": f"Wound Location: {wound_location}. Diagnosis: {result['diagnostics']}. RESVECH Score: {result.get('resvech_assessment', {}).get('total_score', 'N/A')}",
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


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
