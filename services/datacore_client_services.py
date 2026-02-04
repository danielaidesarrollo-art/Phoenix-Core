import httpx
import os
import json

DATACORE_URL = os.getenv("DATACORE_URL", "http://localhost:4000")

class DataCoreClient:
    async def ingest_clinical_data(self, record_id: str, payload: dict):
        """
        Sends clinical data to DataCore for secure storage.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{DATACORE_URL}/api/data/ingest",
                    json={
                        "schema": "clinical_record", # defined in DataCore logic
                        "id": record_id,
                        "payload": payload
                    }
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"[DataCore] Ingestion failed: {e}")
            raise e

    async def retrieve_clinical_data(self, record_id: str):
        """
        Retrieves clinical data from DataCore.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{DATACORE_URL}/api/data/retrieve/{record_id}")
                if response.status_code == 404:
                    return None
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"[DataCore] Retrieval failed: {e}")
            raise e
