
from typing import Dict, List
from datetime import datetime

class WoundAnalyzer:
    """
    Advanced AI analysis engine for Phoenix Core.
    Implements TIMERS (2025/2026) and RESVECH 2.0 Clinical Scales.
    """
    
    # TIMERS Framework (2025/2026 Revisions) - Laboratory Product Mapping
    TIMERS_FRAMEWORK = {
        'T': {
            'name': 'Tissue Management',
            'focus': 'Non-viable tissue, devitalized edges',
            'protocol': 'Hydrosurgery (Smith & Nephew Versajet) or Sharp Debridement.',
            'dressing': 'Smith & Nephew Acticoat (Infection barrier) / Mepilex Absorbent.'
        },
        'I': {
            'name': 'Infection/Inflammation',
            'focus': 'Infection control, Biofilm management',
            'protocol': 'Biofilm disruption and Antimicrobials.',
            'dressing': 'Mölnlycke Mepilex Ag (Silver Antimicrobial) / Smith & Nephew Iodosorb.'
        },
        'M': {
            'name': 'Moisture Balance',
            'focus': 'Exudate management',
            'protocol': 'Exudate control and maceration prevention.',
            'dressing': 'Smith & Nephew Allevyn Life / Mölnlycke Mepilex Border Flex.'
        },
        'E': {
            'name': 'Edge Advancement',
            'focus': 'Epithelial migration',
            'protocol': 'Edge protection and micro-environment stability.',
            'dressing': 'Mölnlycke Mepilex Transfer with Safetac technology.'
        },
        'R': {
            'name': 'Regeneration',
            'focus': 'Closure stimulation',
            'protocol': 'Advanced biological therapies.',
            'dressing': 'Mölnlycke Mepilex Border Flex (High Conformability).'
        },
        'S': {
            'name': 'Social Factors',
            'focus': 'Patient compliance, environment',
            'protocol': 'Integrated patient education.',
            'dressing': 'Safetac technology dressings (Pain-free removal).'
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
        
        timers_data = WoundAnalyzer.TIMERS_FRAMEWORK.get(timers_category, {})
        
        resvech_data = None
        if resvech_params:
            resvech_data = WoundAnalyzer.calculate_resvech(resvech_params)
            
        # Clinical reasoning for Biofilm
        has_biofilm = "HIGH" if (resvech_data and resvech_data.get('biofilm_suspicion')) or tissue_type == 'INFECTED' else "LOW"
        
        urgency = "HIGH" if (resvech_data and resvech_data.get('total_score', 0) > 25) or timers_category == 'I' else "MEDIUM"
        
        result = {
            'status': 'CLINICAL_ANALYSIS_COMPLETE',
            'timestamp': datetime.now().isoformat(),
            'timers_phase': timers_data.get('name', 'N/A'),
            'diagnostics': timers_data.get('focus', 'N/A'),
            'recommendation': timers_data.get('protocol', 'N/A'),
            'specialized_dressing': timers_data.get('dressing', 'N/A'),
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
