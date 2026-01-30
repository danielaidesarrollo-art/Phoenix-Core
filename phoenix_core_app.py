from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import Service Clients
from services.safecore_client import SafeCoreClient
from services.datacore_client import DataCoreClient
from services.biocore_client import BioCoreClient

# Import SDK/Internal logic
from safecore_sdk.middleware import PhoenixDecryptionMiddleware
from safecore_sdk.compliance import ComplianceValidator
from backend.wound_analysis import WoundAnalyzer

app = FastAPI(title="Phoenix Core API")

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
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/", include_in_schema=False)
async def serve_frontend():
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")
    return {"message": "Phoenix Core API is running", "connections": "SafeCore, DataCore, BioCore INTEGRATED"}

# Setup Local Storage
DB_FILE = "local_db.json"

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
    wound_status: str
    compliance: str = "HIPAA_REGULATED"

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
    try:
        data = getattr(request.state, 'decrypted_body', None) or await request.json()
        tissue_type = data.get('tissue_type', 'GRANULATION')
        patient_id = data.get('patient_id', 'P-UNKNOWN')
        
        result = WoundAnalyzer.analyze_tissue(tissue_type)
        
        db = get_db()
        db[patient_id] = {
            **result,
            'patient_id': patient_id,
            'scale': 'VEGA',
            'provider': 'DANIEL_AI_WOUND_CLINIC'
        }
        save_db(db)
        
        return {
            "success": True,
            "patient_id": patient_id,
            "diagnostic": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
