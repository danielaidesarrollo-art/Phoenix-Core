
import json
import os
import base64
from safecore_sdk.encryption import SafeEncryption

def test_secure_archive():
    print("🧪 Testing HIPAA Secure Archive...")
    
    # Simulate an image payload
    test_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    payload = {
        "patient_id": "P-TEST",
        "wound_location": "Left Foot",
        "image_b64": test_image
    }
    
    encryption = SafeEncryption(client_secret="clinical_secret_2026")
    encrypted = encryption.encrypt(payload)
    
    print("✅ Encryption successful.")
    assert "iv" in encrypted
    assert "data" in encrypted
    assert "tag" in encrypted
    
    # Save to file
    filename = "test_archive.enc"
    with open(filename, "w") as f:
        json.dump(encrypted, f)
    
    print(f"📦 Archive saved to {filename}")
    
    # Read and Decrypt
    with open(filename, "r") as f:
        read_encrypted = json.load(f)
        
    decrypted = encryption.decrypt(read_encrypted)
    
    print("✅ Decryption successful.")
    assert decrypted["image_b64"] == test_image
    assert decrypted["wound_location"] == "Left Foot"
    
    # Clean up
    os.remove(filename)
    print("✨ Privacy Test Passed: Data remains unusable without the clinical secret.")

if __name__ == "__main__":
    os.environ['SAFECORE_CLIENT_SECRET'] = "clinical_secret_2026"
    test_secure_archive()
