import json
import random
import uuid
from datetime import datetime, timedelta

def generate_patient(i):
    first_names = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Lucia", "Jorge", "Sofia"]
    last_names = ["Perez", "Rodriguez", "Gomez", "Lopez", "Garcia", "Martinez", "Hernandez", "Sanchez", "Ramirez", "Torres"]
    eps_list = ["Sanitas", "Sura", "Salud Total", "Nueva EPS", "Compensar"]
    programs = ["Clínica de Heridas", "Hospitalización Domiciliaria", "Cuidado Paliativo"]
    
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    birth_date = (datetime.now() - timedelta(days=random.randint(6570, 32850))).strftime("%Y-%m-%d")
    
    return {
        "id": f"P{str(i).zfill(4)}",
        "nombreCompleto": f"{first_name} {last_name}",
        "tipoDocumento": "CC",
        "documento": str(random.randint(10000000, 99999999)),
        "fechaNacimiento": birth_date,
        "genero": random.choice(["Masculino", "Femenino"]),
        "direccion": f"Calle {random.randint(1, 200)} # {random.randint(1, 100)} - {random.randint(1, 100)}",
        "telefonoMovil": f"3{random.randint(0, 2)}{random.randint(0, 9)}{random.randint(1000000, 9999999)}",
        "correoElectronico": f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 99)}@example.com",
        "eps": random.choice(eps_list),
        "programa": random.choice(programs),
        "estado": random.choice(["Aceptado", "Pendiente", "En Tratamiento"]),
        "prioridad": random.choice(["Alta", "Media", "Baja"]),
        "fechaIngreso": (datetime.now() - timedelta(days=random.randint(1, 100))).strftime("%Y-%m-%d")
    }

def generate_wound(patient_id):
    wound_types = ["Úlcera por Presión", "Úlcera Venosa", "Pie Diabético", "Herida Quirúrgica"]
    locations = ["Sacro", "Talón", "Maléolo", "Pie", "Pierna"]
    severities = ["Leve", "Moderada", "Severa"]
    
    wound_id = f"W{uuid.uuid4().hex[:6].upper()}"
    return {
        "id": wound_id,
        "patientId": patient_id,
        "tipo": random.choice(wound_types),
        "localizacion": random.choice(locations),
        "fechaDeteccion": (datetime.now() - timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d"),
        "estado": "En Tratamiento",
        "assessments": [
            {
                "id": str(uuid.uuid4()),
                "woundId": wound_id,
                "date": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                "area": round(random.uniform(2.0, 50.0), 2),
                "tipoTejido": "Granulación: 70%, Esfacelo: 20%",
                "exudado": "Escaso",
                "olor": "Sin olor",
                "bordes": "Regulares",
                "dolor": random.randint(0, 10),
                "signosInfeccion": random.choice([True, False]),
                "aiAnalysis": {
                    "tissueComposition": {
                        "granulation": random.randint(50, 90),
                        "slough": random.randint(5, 30),
                        "necrotic": random.randint(0, 10),
                        "epithelial": random.randint(5, 30)
                    },
                    "severity": random.choice(severities),
                    "confidence": random.randint(85, 99)
                }
            }
        ]
    }

if __name__ == "__main__":
    patients = []
    wounds = []
    
    print("Generando 1000 pacientes y sus heridas...")
    for i in range(1, 1001):
        p = generate_patient(i)
        patients.append(p)
        # Generate 1-2 wounds per patient
        for _ in range(random.randint(1, 2)):
            w = generate_wound(p["id"])
            wounds.append(w)
            
    with open("data/synthetic_patients.json", "w", encoding='utf-8') as f:
        json.dump(patients, f, indent=4, ensure_ascii=False)
        
    with open("data/synthetic_wounds.json", "w", encoding='utf-8') as f:
        json.dump(wounds, f, indent=4, ensure_ascii=False)
        
    print(f"Éxito: Se generaron {len(patients)} pacientes y {len(wounds)} registros de heridas.")
    print("Archivos creados en la carpeta 'data/'.")
