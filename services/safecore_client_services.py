import httpx
import os

SAFECORE_URL = os.getenv("SAFECORE_URL", "http://localhost:3000")

class SafeCoreClient:
    async def verify_session(self, token: str):
        """
        Verifies a session token with SafeCore.
        """
        try:
            async with httpx.AsyncClient() as client:
                # Assuming SafeCore has an inspection or auth endpoint.
                # Based on gateway/server.js, it uses middleware.
                # We'll hit a health or simple endpoint passing the token to verify access.
                response = await client.get(
                    f"{SAFECORE_URL}/health",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code == 200:
                    return {"valid": True, "details": response.json()}
                return {"valid": False}
        except Exception as e:
            print(f"[SafeCore] Error verifying session: {e}")
            return {"valid": False, "error": str(e)}

    async def sanitize_input(self, data: dict):
        """
        Sends data to SafeCore for sanitization/purification.
        Using the ingestion endpoint as a proxy for this example, or a dedicated purify endpoint if available.
        For now, we'll assume a direct call to the orchestration layer or similar.
        """
        # TODO: Implement specific sanitization endpoint if exposed by SafeCore API
        pass
