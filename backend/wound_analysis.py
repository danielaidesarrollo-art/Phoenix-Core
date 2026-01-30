
from typing import Dict, List
from datetime import datetime

class WoundAnalyzer:
    """
    Advanced AI analysis engine for Phoenix Core.
    Implements TIMERS (2025/2026) and RESVECH 2.0 Clinical Scales.
    """
    
    # TIMERS Framework (2025/2026 Revisions)
    TIMERS_FRAMEWORK = {
        'T': {
            'name': 'Tissue Management',
            'focus': 'Non-viable tissue, devitalized edges',
            'protocol': 'Debridement (surgical, enzymatic, or autolytic).'
        },
        'I': {
            'name': 'Infection/Inflammation',
            'focus': 'Infection control, Biofilm management',
            'protocol': 'Topical antimicrobials and biofilm disruption.'
        },
        'M': {
            'name': 'Moisture Balance',
            'focus': 'Exudate management',
            'protocol': 'Absorbent or hydrating dressings based on levels.'
        },
        'E': {
            'name': 'Edge Advancement',
            'focus': 'Epithelial migration',
            'protocol': 'Protective barriers and growth factor stimulation.'
        },
        'R': {
            'name': 'Regeneration',
            'focus': 'Closure stimulation',
            'protocol': 'Advanced therapies (Scaffolds, PRP, Collagen).'
        },
        'S': {
            'name': 'Social Factors',
            'focus': 'Patient compliance, environment',
            'protocol': 'Patient education and adherence monitoring.'
        }
    }

    # Biofilm Management Protocol (2025/2026 Guidelines)
    # The "Step-down to Step-up" clinical approach
    BIOFILM_PROTOCOL = {
        'suspicion_indicators': ['Delayed healing despite optimal care', 'Friable granulation tissue', 'Increased exudate', 'Foul odor', 'Biofilm visible slime (slough-like)'],
        'steps': [
            {"action": "DEBRIDE", "detail": "Frequent and aggressive mechanical/sharp debridement to disrupt biofilm structure."},
            {"action": "CLEANSE", "detail": "Use surfactants (e.g., Betaine/Polyhexanide) for deep cleansing of the wound bed."},
            {"action": "KILL", "detail": "Apply topical antimicrobials (Iodine, Silver, or Honey) for 2-4 weeks (Step-down)."},
            {"action": "PREVENT", "detail": "Use anti-biofilm dressings and monitor for reformation."}
        ]
    }

    @staticmethod
    def calculate_resvech(params: Dict[str, int]) -> Dict:
        """
        RESVECH 2.0 Scale Implementation
        Returns score (0-35) and prognosis.
        """
        # Parameters: 
        # 1. Dimensions (0-6)
        # 2. Depth (0-3)
        # 3. Edges/Margins (0-4)
        # 4. Bed tissue (0-4)
        # 5. Exudate (0-3)
        # 6. Infection/Inflammation (0-15 - simplified version)
        
        total_score = sum(params.values())
        
        prognosis = "HEALED" if total_score == 0 else \
                    "FAVORABLE" if total_score < 10 else \
                    "STAGNANT" if total_score < 25 else \
                    "CRITICAL"
        
        # Risk of Biofilm based on chronicity and stagnation
        biofilm_suspicion = total_score > 15
        
        return {
            "total_score": total_score,
            "max_score": 35,
            "prognosis": prognosis,
            "scale": "RESVECH 2.0",
            "biofilm_suspicion": biofilm_suspicion
        }

    @staticmethod
    def analyze_clinical(tissue_type: str, resvech_params: Dict = None) -> Dict:
        """
        Combined clinical assessment.
        """
        # Map tissue_type to TIMERS
        timers_category = 'T' if tissue_type in ['NECROTIC', 'SLOUGH'] else \
                          'I' if tissue_type == 'INFECTED' else \
                          'E' if tissue_type == 'EPITHELIAL' else \
                          'R' if tissue_type == 'GRANULATION' else 'M'
        
        timers_data = WoundAnalyzer.TIMERS_FRAMEWORK.get(timers_category)
        
        resvech_data = None
        if resvech_params:
            resvech_data = WoundAnalyzer.calculate_resvech(resvech_params)
            
        # Clinical reasoning for Biofilm
        has_biofilm = "HIGH" if (resvech_data and resvech_data['biofilm_suspicion']) or tissue_type == 'INFECTED' else "LOW"
        
        urgency = "HIGH" if (resvech_data and resvech_data['total_score'] > 25) or timers_category == 'I' else "MEDIUM"
        
        result = {
            'status': 'CLINICAL_ANALYSIS_COMPLETE',
            'timestamp': datetime.now().isoformat(),
            'timers_phase': timers_data['name'],
            'diagnostics': timers_data['focus'],
            'recommendation': timers_data['protocol'],
            'biofilm_assessment': WoundAnalyzer.BIOFILM_PROTOCOL if has_biofilm == "HIGH" else None,
            'resvech_assessment': resvech_data,
            'urgency_level': urgency,
            'engine': 'DANIEL_AI_PHOENIX_V3_BIO'
        }
        
        return result

if __name__ == "__main__":
    # Test case: High urgency infected wound
    params = {"dim": 5, "depth": 3, "edges": 4, "bed": 4, "exudate": 3, "inf": 10}
    print(WoundAnalyzer.analyze_clinical('INFECTED', params))
