"""
Phoenix Core - Wound Healing Engine
"""
from typing import Dict, List, Any
from datetime import datetime

class WoundHealingEngine:
    RESVECH_INTERPRETATION = {
        (0, 5): "Favorable: Herida en buen proceso de cicatrización",
        (6, 10): "Moderado: Herida con cicatrización lenta",
        (11, 15): "Dificultad: Herida con dificultad para cicatrizar",
        (16, 35): "Crítico: Alto riesgo de complicaciones / Estancamiento"
    }

    def evaluate_time(self, patient_id: str, assessment: Dict[str, Any]) -> Dict[str, Any]:
        tissue = assessment.get("tissue", "Granulación")
        infection = assessment.get("infection", "Ausente")
        moisture = assessment.get("moisture", "Húmedo")
        edge = assessment.get("edge", "Activo")
        recs = []
        if tissue in ["Necrótico", "Esfacelo"]: recs.append("T: Desbridamiento requerido")
        if infection in ["Moderada", "Severa"]: recs.append("I: Control de carga bacteriana")
        return {
            "patient_id": patient_id, "timestamp": datetime.utcnow().isoformat(),
            "methodology": "TIME", "findings": {"T": tissue, "I": infection, "M": moisture, "E": edge},
            "recommendations": recs
        }

    def calculate_resvech_score(self, data: Dict[str, Any]) -> Dict[str, Any]:
        score = data.get("area_points", 0) + data.get("depth_points", 0) + data.get("tissue_points", 0) + data.get("exudate_points", 0) + data.get("infection_points", 0)
        interpretation = next((desc for (low, high), desc in self.RESVECH_INTERPRETATION.items() if low <= score <= high), "Desconocido")
        return {"score": score, "interpretation": interpretation}
