import httpx
import os

BIOCORE_URL = os.getenv("BIOCORE_URL", "http://localhost:3001")

class BioCoreClient:
    async def authenticate_biometric(self, user_id: str, biometric_data: str, liveness: bool = True):
        """
        Delegates biometric authentication to BioCore.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{BIOCORE_URL}/api/auth/bio",
                    json={
                        "userId": user_id,
                        "biometricData": biometric_data,
                        "livenessVerified": liveness
                    }
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"[BioCore] Authentication failed: {e}")
            raise e
