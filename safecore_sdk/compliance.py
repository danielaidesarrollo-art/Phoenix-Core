import os
import json
import base64

class ComplianceValidator:
    def __init__(self, root_path=None):
        self.root_path = root_path or os.getcwd()
        self.manifest_path = os.path.join(self.root_path, 'manifest.json')

    def validate(self):
        try:
            if not os.path.exists(self.manifest_path):
                return {"valid": False, "error": "Manifest missing. Compliance check failed."}

            with open(self.manifest_path, 'r') as f:
                manifest = json.load(f)

            # Required Fields Check
            required = ['project_name', 'compliance_level', 'features']
            for field in required:
                if field not in manifest:
                    return {"valid": False, "error": f"Missing required field: {field}"}

            # Compliance Fingerprint (deterministic base64 representation of security state)
            compliance_data = {
                "id": manifest.get("project_id", "unregistered"),
                "level": manifest.get("compliance_level"),
                "features": manifest.get("features")
            }
            
            # Match JS behavior: compact JSON (no spaces)
            compact_json = json.dumps(compliance_data, separators=(',', ':'))
            fingerprint = base64.b64encode(compact_json.encode()).decode()

            return {
                "valid": True,
                "packageName": manifest.get("project_name"),
                "level": manifest.get("compliance_level"),
                "fingerprint": fingerprint
            }
        except Exception as e:
            return {"valid": False, "error": f"Validation Error: {str(e)}"}
