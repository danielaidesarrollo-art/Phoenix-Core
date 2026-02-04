from .analyzer import WoundAnalyzer
from .catalog import CatalogManager
from .stats import StatisticsService

class PhoenixService:
    """
    Core logic for Phoenix Wound Clinic.
    Routes Admin tasks to Gemini Flash and Clinical tasks to Med-Gemma.
    """
    def __init__(self):
        self.astra_ready = True # Flag for Multimodal capability
        self.analyzer = WoundAnalyzer()
        self.catalog = CatalogManager()
        self.stats = StatisticsService()
        
        return self.stats.get_quarterly_supply_usage()
        
    def analyze_wound_image(self, data: dict):
        """
         Clinical Inference -> ROUTE TO MED-GEMMA (Real)
        """
        from .medgemma_wound_client import MedGemmaWoundClient
        
        client = MedGemmaWoundClient()
        
        # 1. Obtener análisis clínico de Med-Gemma
        ai_result = client.analyze_wound(
            image_data=data.get("image_base64"), 
            clinical_context={"patient_id": data.get("patient_id"), "notes": data.get("notes")}
        )
        
        # 2. Extraer parámetros normalizados
        parameters = ai_result.get("parameters", {
            # Fallback safes
            "size": 0, "depth": 0, "edges": 0, "tissue_type": 0, "exudate": 0, "infection_inflammation": 0
        })
        
        # Mapping helpers si es necesario convertir strings a ints para el algoritmo legacy
        # (Asumiendo que analyzer.calculate_resvech_score maneja los datos o los convertimos aquí)
        
        resvech_score = self.analyzer.calculate_resvech_score(parameters)
        timers_assessment = self.analyzer.get_timers_assessment(parameters)
        biofilm_protocol = self.analyzer.get_biofilm_protocol(parameters.get("infection_inflammation", 0))
        product_results = self.catalog.get_recommendations(timers_assessment, resvech_score, parameters)

        return {
            "model_used": "Med-Gemma-2b (Wound-Tuned)",
            "resvech_score": resvech_score,
            "timers": timers_assessment,
            "biofilm_protocol": biofilm_protocol,
            "sponsored_products": product_results["recommended"],
            "misaligned_products": product_results["misaligned"],
            "analysis": {
                "tissue_type": parameters.get("tissue_type_desc", "Unknown"),
                "infection_risk": ai_result.get("risk_analysis", "Pending Evaluation"),
                "suggested_protocol": ai_result.get("recommended_action", "Standard Care")
            },
            "astra_metadata": {
                "latency_ms": "Dynamic",
                "source": data.get("source", "Standard_Upload")
            }
        }
