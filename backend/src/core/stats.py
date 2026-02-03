import random
from datetime import datetime, timedelta

class StatisticsService:
    """
    Generates clinical analytics and supply usage statistics.
    Simulates database aggregation for dashboard reporting.
    """
    
    def get_quarterly_supply_usage(self):
        """
        Returns aggregated usage of dressings/products for the last 3 months.
        """
        # Simulated data - In production this would query a transaction DB
        return {
            "period": "Q4 2025 (Last Quarter)",
            "total_units": 1245,
            "cost_efficiency": "+12%",
            "categories": [
                {"name": "Foam Dressings (Allevyn)", "usage": 450, "trend": "up"},
                {"name": "Antimicrobials (Acticoat)", "usage": 320, "trend": "steady"},
                {"name": "Hydrosurgery Kits (Versajet)", "usage": 85, "trend": "up"},
                {"name": "Hydrocolloids", "usage": 210, "trend": "down"},
                {"name": "Negative Pressure (PICO)", "usage": 180, "trend": "up"}
            ],
            "monthly_breakdown": {
                "Oct": 380,
                "Nov": 410,
                "Dec": 455
            }
        }
