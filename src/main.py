from fastapi import FastAPI, Request, HTTPException
import os
from datetime import datetime
from services.wound_engine import WoundHealingEngine

app = FastAPI(title="PHOENIX Core", version="2.0.0")
wound_engine = WoundHealingEngine()

@app.get("/health")
async def health():
    return {"status": "active", "core": "Phoenix", "capability": "Wound Care Management"}

@app.post("/api/wounds/assess")
async def assess_wound(request: Request):
    data = await request.json()
    patient_id = data.get("patient_id", "ST-000")
    assessment = data.get("assessment", {})
    
    result = wound_engine.evaluate_time(patient_id, assessment)
    return result

@app.post("/api/wounds/resvech")
async def calculate_resvech(request: Request):
    data = await request.json()
    result = wound_engine.calculate_resvech_score(data)
    return result

@app.get("/api/compliance")
async def compliance():
    return {
        "valid": True,
        "packageName": "phoenix-healing-core",
        "level": "L3-CLINICAL",
        "fingerprint": "SIRIUS_PHOENIX_V2",
        "system_state": "ACTIVE",
        "timestamp": datetime.now().isoformat()
    }
