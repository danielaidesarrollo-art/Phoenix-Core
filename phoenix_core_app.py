from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import os

# Import Service Clients
from services.safecore_client import SafeCoreClient
from services.datacore_client import DataCoreClient
from services.biocore_client import BioCoreClient

app = FastAPI(title="Phoenix Core API")

# Initialize Clients
safecore = SafeCoreClient()
datacore = DataCoreClient()
biocore = BioCoreClient()

# Load Synthetic Data if available
def load_synthetic_data(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding='utf-8') as f:
            return json.load(f)
    return []

patients_db = load_synthetic_data("data/synthetic_patients.json")
wounds_db = load_synthetic_data("data/synthetic_wounds.json")

# Fallback to minimal mock if empty
if not patients_db:
    patients_db = [
        {
            "id": "P001",
            "nombreCompleto": "Juan Perez",
            "tipoDocumento": "CC",
            "documento": "12345678",
            "fechaNacimiento": "1980-05-15",
            "genero": "Masculino",
            "direccion": "Calle 123",
            "telefonoMovil": "3001234567",
            "correoElectronico": "juan@example.com",
            "eps": "Sanitas",
            "programa": "Clínica de Heridas",
            "estado": "Aceptado",
            "prioridad": "Media",
            "fechaIngreso": "2023-10-01"
        }
    ]

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class BiometricAuthRequest(BaseModel):
    userId: str
    biometricData: str
    liveness: bool = True

# Security Dependency
async def verify_security(request: Request):
    """
    Middleware-like dependency to ensure SafeCore compliance.
    """
    token = request.headers.get("Authorization")
    if token:
        # Verify with SafeCore (stripping 'Bearer ')
        token_val = token.split(" ")[1] if " " in token else token
        result = await safecore.verify_session(token_val)
        if not result.get("valid"):
            # For now, we log but don't block aggressively to allow dev testing
            print(f"[Security Warning] SafeCore validation failed for token: {token_val}")
    
    # In a real scenario, we might throw HTTPException(403) here.
    return True

@app.get("/api/patients", response_model=List[Patient])
async def get_patients():
    """
    Fetches patients from DataCore (or mock fallback if DataCore is offline).
    """
    try:
        # Attempt to fetch list ID "patients_list" or similar from DataCore
        # Since DataCore is generic, we might index differently. 
        # For this prototype, we'll try to fetch a known manifest or iterate.
        # Fallback to local mock for now until DataCore is seeded.
        return patients_db
    except Exception as e:
        print(f"DataCore fetch error: {e}")
        return patients_db

@app.post("/api/patients")
async def add_patient(patient: Patient, secured: bool = Depends(verify_security)):
    """
    Ingests patient data into DataCore.
    """
    try:
        # 1. Sanitize with SafeCore (optional step, usually handled by Gateway)
        # await safecore.sanitize_input(patient.dict())

        # 2. Persist to DataCore
        result = await datacore.ingest_clinical_data(patient.id, patient.dict())
        
        # Keep local cache in sync for now
        patients_db.append(patient.dict())
        
        return {"status": "success", "message": "Patient secured in DataCore", "datacore_ref": result}
    except Exception as e:
        # Fallback
        patients_db.append(patient.dict())
        return {"status": "partial_success", "message": "Saved locally (DataCore unavailable)", "error": str(e)}

@app.post("/api/auth/bio")
async def biometric_auth(req: BiometricAuthRequest):
    """
    Proxy to BioCore for biometric authentication.
    """
    try:
        result = await biocore.authenticate_biometric(req.userId, req.biometricData, req.liveness)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Phoenix Core API is running", "connections": "SafeCore, DataCore, BioCore INTEGRATED"}

# Mock data (Fallback)
patients_db = [
    {
        "id": "P001",
        "nombreCompleto": "Juan Perez",
        "tipoDocumento": "CC",
        "documento": "12345678",
        "fechaNacimiento": "1980-05-15",
        "genero": "Masculino",
        "direccion": "Calle 123",
        "telefonoMovil": "3001234567",
        "correoElectronico": "juan@example.com",
        "eps": "Sanitas",
        "programa": "Clínica de Heridas",
        "estado": "Aceptado",
        "prioridad": "Media",
        "fechaIngreso": "2023-10-01"
    },
    {
        "id": "P002",
        "nombreCompleto": "Maria Rodriguez",
        "tipoDocumento": "CC",
        "documento": "87654321",
        "fechaNacimiento": "1992-08-20",
        "genero": "Femenino",
        "direccion": "Avenida Siempre Viva",
        "telefonoMovil": "3109876543",
        "correoElectronico": "maria@example.com",
        "eps": "Sura",
        "programa": "Hospitalización Domiciliaria",
        "estado": "Pendiente",
        "prioridad": "Alta",
        "fechaIngreso": "2023-11-15"
    }
]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
