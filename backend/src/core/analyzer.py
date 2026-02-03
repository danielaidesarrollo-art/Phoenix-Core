class WoundAnalyzer:
    """
    Implements clinical logic for wound assessment:
    - RESVECH 2.0 Scale (0-35 points)
    - TIMERS Framework Assessment
    - Biofilm Management Recommendations
    """

    def calculate_resvech_score(self, parameters: dict) -> int:
        """
        Calculates the RESVECH 2.0 score.
        Expected parameters:
        - size: 0-5
        - depth: 0-3
        - edges: 0-3
        - tissue_type: 0-6
        - exudate: 0-5
        - infection_inflammation: 0-10
        """
        score = 0
        score += parameters.get("size", 0)
        score += parameters.get("depth", 0)
        score += parameters.get("edges", 0)
        score += parameters.get("tissue_type", 0)
        score += parameters.get("exudate", 0)
        score += parameters.get("infection_inflammation", 0)
        return min(score, 35)

    def get_timers_assessment(self, parameters: dict) -> dict:
        """
        Generates TIMERS assessment based on clinical findings.
        """
        assessment = {}
        
        # T: Tissue
        tissue = parameters.get("tissue_type_desc", "").lower()
        if "necrotic" in tissue or "slough" in tissue:
            assessment["T"] = {"status": "Non-viable tissue", "action": "Debridement required"}
        else:
            assessment["T"] = {"status": "Viable", "action": "Maintain healthy bed"}
            
        # I: Infection/Inflammation
        inf_score = parameters.get("infection_inflammation", 0)
        if inf_score > 3:
            assessment["I"] = {"status": "Infection/Biofilm suspected", "action": "Antimicrobials/Anti-biofilm agents"}
        else:
            assessment["I"] = {"status": "Controlled", "action": "Monitor for signs"}
            
        # M: Moisture
        exudate = parameters.get("exudate_desc", "").lower()
        if "high" in exudate or "heavy" in exudate:
            assessment["M"] = {"status": "Maceration risk", "action": "Absorbent dressings"}
        elif "dry" in exudate:
            assessment["M"] = {"status": "Desiccated", "action": "Hydrate wound bed"}
        else:
            assessment["M"] = {"status": "Balanced", "action": "Protect moisture balance"}
            
        # E: Edges
        edges = parameters.get("edges_desc", "").lower()
        if "non-advancing" in edges or "undermined" in edges:
            assessment["E"] = {"status": "Stalled edges", "action": "Address underlying causes/Biofilm"}
        else:
            assessment["E"] = {"status": "Advancing", "action": "Protect wound margin"}
            
        return assessment

    def get_biofilm_protocol(self, infection_score: int) -> list:
        """
        Specific protocols for biofilm management.
        """
        if infection_score >= 5:
            return [
                "Aggressive debridement (Sharp/Mechanical)",
                "Topical anti-biofilm agents (e.g., Cadexomer Iodine)",
                "Sequential antimicrobial therapy",
                "Regular disruption of biofilm (every 24-48h)"
            ]
        return ["Standard cleansing", "Standard antimicrobial dressing if clinically indicated"]
