import httpx
import os
import json

class ProposalGenerator:
    """
    Generates 'New Technology Request' proposals acting as a Health Economics Analyst.
    """
    def __init__(self):
        self.gateway_url = os.environ.get("GATEWAY_URL", "http://localhost:4000/v1/copilot/invoke")
        self.role_definition = """
        Rol: Actúa como un Analista de Economía de la Salud y Gerente de Compras Hospitalarias.
        Tarea: Generar una propuesta de alta para la inclusión de una nueva tecnología médica en el catálogo del sistema institucional "Phoenix".
        Objetivo: Justificar la adquisición basándose en el modelo de "Costo Total del Procedimiento" y eficiencia operativa.
        """

    async def generate(self, data: dict) -> dict:
        """
        Generates the proposal text based on input data.
        """
        prompt = self._construct_prompt(data)
        
        # Payload for the AI Gateway (Copilot/Gemini)
        # Adjusting structure based on typical Gateway usage seen in Phoenix
        payload = {
            "type": "text_generation",
            "app": "phoenix",
            "prompt": prompt,
            "system_instruction": self.role_definition,
            "temperature": 0.3 # Low temperature for professional/analytical output
        }

        async with httpx.AsyncClient() as client:
            try:
                # We assume the gateway accepts a POST with this structure
                response = await client.post(self.gateway_url, json=payload, timeout=60.0)
                response.raise_for_status()
                result = response.json()
                
                # Assuming the gateway returns something like {"content": "..."} or {"response": "..."}
                # If we don't know the exact structure, we try to extract common fields
                content = result.get("content") or result.get("response") or result.get("text") or str(result)
                
                return {
                    "success": True,
                    "proposal_text": content,
                    "metadata": {
                        "model": "HealthEconomicsAI",
                        "timestamp": "now"
                    }
                }
            except Exception as e:
                print(f"[ProposalGenerator] Error calling gateway: {e}")
                # Fallback purely for demonstration if Gateway is offline/mocked
                return {
                    "success": False,
                    "error": str(e), 
                    "fallback_msg": "Gateway unavailable. Ensure GATEWAY_URL is reachable."
                }

    def _construct_prompt(self, data: dict) -> str:
        """
        Constructs the detailed prompt from the JSON input.
        """
        tech_name = data.get("tech_name", "N/A")
        tech_function = data.get("tech_function", "N/A")
        
        # Build sections based on data or defaults
        efficiency_kpis = data.get("efficiency_kpis", {})
        cost_offsets = data.get("cost_offsets", {})
        safety = data.get("safety", {})
        costs = data.get("costs", {})

        prompt = f"""
        Por favor, estructura esta información en un formato de "Solicitud de Nueva Tecnología" compatible con el sistema Phoenix.
        Incluye una sección de Análisis de Retorno de Inversión (ROI) cualitativo y cuantitativo.

        DATOS DE LA TECNOLOGÍA:
        1. Resumen:
           - Nombre: {tech_name}
           - Función: {tech_function}
           - Categoría: {data.get("category", "Equipo Médico")}

        2. Justificación de Eficiencia Operativa (KPIs):
           - Tiempo en Quirófano: {efficiency_kpis.get("or_time_reduction", "N/A")}
           - Frecuencia Intervenciones: {efficiency_kpis.get("interventions_reduction", "N/A")}
           - Estancia Hospitalaria (LOS): {efficiency_kpis.get("los_reduction", "N/A")}

        3. Análisis de Compensación de Costos (Cost-Offsets):
           - Insumos Eliminados: {cost_offsets.get("consumables_saved", "N/A")}
           - Reducción Instrumental: {cost_offsets.get("instrument_reduction", "N/A")}

        4. Seguridad y Calidad:
           - Prevención Readmisiones: {safety.get("readmission_prevention", "N/A")}
           - Preservación Tejido: {safety.get("tissue_preservation", "N/A")}

        5. Estructura de Costos:
           - CAPEX: {costs.get("capex", "N/A")}
           - OPEX: {costs.get("opex", "N/A")}

        Solicitud Final: Genera el documento formal.
        """
        return prompt
