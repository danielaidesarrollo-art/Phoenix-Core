
import sys
import os

# Add the project root to sys.path to import the backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.wound_analysis import WoundAnalyzer

def test_timers_and_resvech():
    print("🧪 Testing Clinical Protocols: TIMERS + RESVECH 2.0")
    
    # Test Case 1: Critical Infected Wound
    print("\n[Case 1] Infected Wound (Critical)")
    params_critical = {"dim": 6, "depth": 3, "edges": 4, "bed": 4, "exudate": 3, "inf": 12}
    result_1 = WoundAnalyzer.analyze_clinical('INFECTED', params_critical)
    
    print(f"TIMERS Phase: {result_1['timers_phase']}")
    print(f"RESVECH Score: {result_1['resvech_assessment']['total_score']}")
    print(f"Prognosis: {result_1['resvech_assessment']['prognosis']}")
    print(f"Urgency: {result_1['urgency_level']}")
    
    assert result_1['timers_phase'] == 'Infection/Inflammation'
    assert result_1['resvech_assessment']['total_score'] == 32
    assert result_1['resvech_assessment']['prognosis'] == 'CRITICAL'
    assert result_1['urgency_level'] == 'HIGH'
    print("✅ Case 1 passed.")

    # Test Case 2: Epithelializing Wound (Favorable)
    print("\n[Case 2] Epithelializing Wound (Favorable)")
    params_favorable = {"dim": 1, "depth": 0, "edges": 1, "bed": 1, "exudate": 0, "inf": 2}
    result_2 = WoundAnalyzer.analyze_clinical('EPITHELIAL', params_favorable)
    
    print(f"TIMERS Phase: {result_2['timers_phase']}")
    print(f"RESVECH Score: {result_2['resvech_assessment']['total_score']}")
    print(f"Prognosis: {result_2['resvech_assessment']['prognosis']}")
    print(f"Urgency: {result_2['urgency_level']}")
    
    assert result_2['timers_phase'] == 'Edge Advancement'
    assert result_2['resvech_assessment']['total_score'] == 5
    assert result_2['resvech_assessment']['prognosis'] == 'FAVORABLE'
    assert result_2['urgency_level'] == 'MEDIUM'
    print("✅ Case 2 passed.")

    # Test Case 3: Biofilm Suspected (Chronic/Stagnant)
    print("\n[Case 3] Biofilm Suspected (Chronic/Stagnant)")
    params_biofilm = {"dim": 4, "depth": 1, "edges": 3, "bed": 3, "exudate": 2, "inf": 5} # Total 18 > 15
    result_3 = WoundAnalyzer.analyze_clinical('GRANULATION', params_biofilm)
    
    print(f"RESVECH Score: {result_3['resvech_assessment']['total_score']}")
    print(f"Biofilm Assessment: {'PRESENT' if result_3['biofilm_assessment'] else 'ABSENT'}")
    
    assert result_3['resvech_assessment']['total_score'] == 18
    assert result_3['biofilm_assessment'] is not None
    assert result_3['biofilm_assessment']['steps'][0]['action'] == 'DEBRIDE'
    print("✅ Case 3 passed.")

    print("\n✨ All clinical verification tests (including Biofilm) passed!")

if __name__ == "__main__":
    try:
        test_timers_and_resvech()
    except AssertionError as e:
        print(f"❌ Verification failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        sys.exit(1)
