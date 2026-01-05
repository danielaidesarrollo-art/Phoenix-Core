from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(title="Phoenix Core API")

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

# Mock data
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

@app.get("/api/patients", response_model=List[Patient])
async def get_patients():
    return patients_db

@app.post("/api/patients")
async def add_patient(patient: Patient):
    patients_db.append(patient.dict())
    return {"status": "success", "message": "Patient added"}

@app.get("/")
async def root():
    return {"message": "Phoenix Core API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
