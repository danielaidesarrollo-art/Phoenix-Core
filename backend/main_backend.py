from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from src.core.phoenix_service import PhoenixService

app = FastAPI(title="Phoenix Wound Clinic API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (Frontend Build)
# This directory will be populated by the Docker build process
static_dir = "static"
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=f"{static_dir}/assets"), name="assets")
    # You might need to mount other root files like manifest.json here or handle them in the catch-all

phoenix_service = PhoenixService()

@app.get("/")
def health_check():
    return {"status": "Phoenix Nucleus Online", "division": "Medical"}

@app.post("/api/analyze_wound")
async def analyze_wound(data: dict):
    # This will route to Med-Gemma via PhoenixService
    return phoenix_service.analyze_wound_image(data)

@app.get("/api/stats/supply_usage")
async def get_supply_stats():
    # Only for authorized clinic admins
    return phoenix_service.get_supply_stats()

# Catch-all for SPA (must be last)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If API path not found, let it 404 naturally (FastAPI handles it if defined above, 
    # but here we might capture it. We should return index.html only for non-api routes)
    if full_path.startswith("api"):
        return {"error": "API endpoint not found"}
        
    if os.path.exists(static_dir):
        # Serve specific root files if they exist in static root
        file_path = os.path.join(static_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Default to index.html for SPA routing
        return FileResponse(os.path.join(static_dir, "index.html"))
        
    return {"status": "Backend Only Mode (Frontend not built)"}
