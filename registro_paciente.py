from google.cloud import firestore
from datetime import datetime
db = firestore.Client(project='daniel-ai-stellar-2026-483302')
doc_ref = db.collection('clinica_heridas').document('P001')
doc_ref.set({
    'nombre': 'Juan Pérez - Prueba',
    'diagnostico': 'Úlcera fase 2',
    'fecha': datetime.now(),
    'compliance': 'HIPAA_REGULATED'
})
print("✅ ¡Éxito! Paciente registrado en Phoenix Core.")
