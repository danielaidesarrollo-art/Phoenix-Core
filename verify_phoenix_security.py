import sys
import os

# Add Phoenix-Core to sys.path to import local modules
sys.path.append(os.getcwd())

from safecore_sdk.encryption import SafeEncryption
from safecore_sdk.compliance import ComplianceValidator
import json

# Setup environment
os.environ['SAFECORE_CLIENT_SECRET'] = 'test-secret-123'

def test_compliance():
    print("Testing Compliance Validator...")
    # manifest.json should already be in the Phoenix-Core root (current dir for this test)
    validator = ComplianceValidator()
    result = validator.validate()
    print(f"Compliance Valid: {result.get('valid')}")
    print(f"Fingerprint: {result.get('fingerprint')}")
    return result.get('valid')

def test_encryption_interop():
    print("\nTesting AES-256-GCM Symmetrics...")
    encryptor = SafeEncryption('test-secret-123')
    payload = {"test": "data", "id": 123}
    
    encrypted = encryptor.encrypt(payload)
    print(f"Encrypted: {encrypted}")
    
    decrypted = encryptor.decrypt(encrypted)
    print(f"Decrypted: {decrypted}")
    
    return payload == decrypted

if __name__ == "__main__":
    c_ok = test_compliance()
    e_ok = test_encryption_interop()
    
    if c_ok and e_ok:
        print("\nVerification: ✅ SUCCESS - Phoenix Security Layer is operational.")
    else:
        print("\nVerification: ❌ FAILED")
        sys.exit(1)
