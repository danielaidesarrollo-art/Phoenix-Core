from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from .encryption import SafeEncryption
import json
import os

class PhoenixDecryptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Check if request is encrypted
        if request.headers.get('x-safecore-encrypted') != 'true':
            # Strict mode: Enforce encryption for non-get requests if configured
            if os.getenv('ENFORCE_ENCRYPTION') == 'true' and request.method != 'GET':
                return Response(content=json.dumps({"error": "Encryption Required"}), status_code=403, media_type="application/json")
            return await call_next(request)

        # 2. Process Encrypted Payload
        try:
            body = await request.json()
            encryptor = SafeEncryption()
            decrypted_body = encryptor.decrypt(body)
            
            # Replace request body with decrypted data
            # FastAPI makes this a bit tricky for middleware, but we can store it in state
            # or use a custom request class. For simplicity in validation:
            request.state.decrypted_body = decrypted_body
            request.state.is_encrypted = True
            
            # We also need to "reset" the body for the route handlers
            # In a real heavy app, we'd use a more robust body replacement trick
            # For this verification, we'll assume the route looks for request.state.decrypted_body if present
            
            return await call_next(request)
            
        except Exception as e:
            print(f"[SafeCore] Decryption Failed: {str(e)}")
            return Response(content=json.dumps({"error": "Decryption Failed"}), status_code=403, media_type="application/json")
