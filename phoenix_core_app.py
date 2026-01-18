
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import json
from safecore_sdk.middleware import PhoenixDecryptionMiddleware
from safecore_sdk.compliance import ComplianceValidator
from datetime import datetime
from backend.wound_analysis import WoundAnalyzer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Phoenix Core API")
app.add_middleware(PhoenixDecryptionMiddleware)

# Serve static files from the build directory
app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

@app.get("/", include_in_schema=False)
async def serve_frontend():
    return FileResponse("dist/index.html")

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

class ClinicalRecord(BaseModel):
    patient_id: str
    wound_status: str
    compliance: str = "HIPAA_REGULATED"

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
@app.post("/api/diagnose")
async def diagnose_wound(request: Request):
    """
    Station-3 Diagnostic Endpoint: Wound Clinic AI analysis.
    """
    try:
        # Check for encrypted payload from Polaris/Sirius flow
        data = getattr(request.state, 'decrypted_body', None) or await request.json()
        
        tissue_type = data.get('tissue_type', 'GRANULATION')
        patient_id = data.get('patient_id', 'P-UNKNOWN')
        
        # Run AI Diagnostic Engine
        result = WoundAnalyzer.analyze_tissue(tissue_type)
        
        # Sync with Vega (Local DB for this simulation)
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
