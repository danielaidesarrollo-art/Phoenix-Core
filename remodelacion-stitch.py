import os
carpetas = ['components', 'context', 'data', 'hooks', 'utils']
print("🏗️ Reconstruyendo Clínica de Heridas para DANIEL_AI...")
for f in carpetas:
    if not os.path.exists(f):
        os.makedirs(f)
        print(f"✅ Carpeta '{f}' vinculada.")
print("\n🚀 ¡MOLDE LISTO! Ya puedes subir tu código del disco duro.")
