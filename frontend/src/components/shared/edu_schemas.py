from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class LearningModule(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str  # e.g., "Beginner", "Intermediate", "Advanced"
    estimated_time: int  # in minutes
    estimated_tokens: int = 500 # Estimated generation cost

class ResourceUsage(BaseModel):
    user_id: str
    daily_tokens: int = 0
    quota_limit: int = 50000
    last_access: datetime = datetime.now()

class UserEducationalProgress(BaseModel):
    user_id: str
    core: str  # "athena" or "aristoteles"
    completed_modules: List[str] = []
    current_level: int = 1
    xp: int = 0
    gamification_tokens: Dict[str, Any] = {} # e.g., {"SBT": [], "PuntosLiquidez": 0, "LifePoints": 100}
    last_updated: datetime = datetime.now()
    resource_usage: Optional[ResourceUsage] = None

class EducationalTriageIntent(BaseModel):
    intent: str  # "financial_education", "medical_training", "general"
    score: float
    detected_entities: List[str]
    suggested_core: Optional[str] = None
