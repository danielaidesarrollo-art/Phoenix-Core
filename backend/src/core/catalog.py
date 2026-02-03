class CatalogManager:
    """
    Manages sponsored products with granular clinical alignment rules.
    Rules are derived from WUWHS, EWMA, and GNEAUPP (RESVECH) guidelines.
    """
    def __init__(self):
        self.products = [
            {
                "id": "s-n-versajet-01",
                "name": "VERSAJET Hydrosurgery System",
                "manufacturer": "Smith & Nephew",
                "category": "Debridement",
                "description": "Precision hydrosurgery for rapid debridement.",
                "alignment": "TIMERS: T (Non-viable tissue)",
                "link": "https://www.smith-nephew.com/versajet",
                "rules": {
                    "timers": {"T": ["Non-viable", "Necrotic", "Slough"]},
                    "resvech_min_tissue": 4 # Corresponds to Slough/Necrosis
                }
            },
            {
                "id": "s-n-acticoat-01",
                "name": "ACTICOAT Silver Dressing",
                "manufacturer": "Smith & Nephew",
                "category": "Antimicrobial",
                "description": "Nanocrystalline silver for infection management.",
                "alignment": "TIMERS: I (Infection/Inflammation)",
                "link": "https://www.smith-nephew.com/acticoat",
                "rules": {
                    "timers": {"I": ["Infection", "Biofilm"]},
                    "resvech_min_infection": 3
                }
            },
            {
                "id": "s-n-allevyn-01",
                "name": "ALLEVYN Life Foam",
                "manufacturer": "Smith & Nephew",
                "category": "Exudate Management",
                "description": "Multi-layer foam for moderate to high exudate.",
                "alignment": "TIMERS: M (Moisture Balance)",
                "link": "https://www.smith-nephew.com/allevyn",
                "rules": {
                    "timers": {"M": ["High", "Heavy", "Maceration"]},
                    "resvech_min_exudate": 3
                }
            },
            {
                "id": "smith-regranex-01",
                "name": "REGRANEX Gel",
                "manufacturer": "Smith & Nephew",
                "category": "Regenerative",
                "description": "PDGF-BB for diabetic foot ulcers.",
                "alignment": "TIMERS: R (Regeneration) - REQUIRE CLEAN BED",
                "link": "https://www.smith-nephew.com/regranex",
                "rules": {
                    "timers": {"T": ["Viable", "Healthy"]},
                    "resvech_max_infection": 2, # REJECT if > 2
                    "resvech_max_slough": 2      # REJECT if > 2
                }
            }
        ]

    def get_recommendations(self, timers_assessment: dict, resvech_score: int, parameters: dict) -> dict:
        """
        Filters products and identifies misalignments for transparency.
        """
        recommended = []
        misaligned = []
        
        for product in self.products:
            is_recommended = False
            rejection_reasons = []
            rules = product["rules"]
            
            # 1. Check Alignment Rules
            for key, triggers in rules.get("timers", {}).items():
                current_status = timers_assessment.get(key, {}).get("status", "")
                if any(t.lower() in current_status.lower() for t in triggers):
                    is_recommended = True
                elif key == "T" and "max_slough" in rules:
                    # Specific check for exclusion
                    pass
            
            # 2. Check Thresholds (Inclusion)
            if "resvech_min_tissue" in rules and parameters.get("tissue_type", 0) >= rules["resvech_min_tissue"]:
                is_recommended = True
            if "resvech_min_infection" in rules and parameters.get("infection_inflammation", 0) >= rules["resvech_min_infection"]:
                is_recommended = True
            if "resvech_min_exudate" in rules and parameters.get("exudate", 0) >= rules["resvech_min_exudate"]:
                is_recommended = True

            # 3. Check Exclusions (Rejection Logic)
            if "resvech_max_infection" in rules and parameters.get("infection_inflammation", 0) > rules["resvech_max_infection"]:
                is_recommended = False
                rejection_reasons.append(f"Contrainduced: High Infection ({parameters.get('infection_inflammation')})")
            
            if "resvech_max_slough" in rules and parameters.get("tissue_type", 0) > rules["resvech_max_slough"]:
                is_recommended = False
                rejection_reasons.append(f"Contrainduced: Necrotic/Slough load too high ({parameters.get('tissue_type')})")

            if is_recommended:
                recommended.append(product)
            elif rejection_reasons:
                misaligned_product = product.copy()
                misaligned_product["rejection_reasons"] = rejection_reasons
                misaligned.append(misaligned_product)
                
        return {"recommended": recommended, "misaligned": misaligned}
