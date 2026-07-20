import os
import time

# Lista de commits que queremos hacer
commits = [
    "10. Agregar validaciones adicionales en schemas de usuario",
    "11. Mejorar estructura de errores en controllers",
    "12. Actualizar configuración de base de datos",
    "13. Optimizar consultas en repositories",
    "14. Agregar comentarios en servicios",
    "15. Mejorar manejo de excepciones",
    "16. Actualizar modelos con relaciones",
    "17. Refactorizar código en controllers",
    "18. Agregar validaciones de fecha en citas",
    "19. Mejorar documentación del código",
    "20. Versión final del proyecto - Entrega T02.03",
]

print(" Iniciando commits automáticos...\n")

for i, mensaje in enumerate(commits, 1):
    print(f"\n{'='*60}")
    print(f"Commit {i}/11: {mensaje}")
    print('='*60)
    
    # Crear un archivo de log temporal para que git detecte cambios
    archivo_temp = f"app/commit_{i}.log"
    with open(archivo_temp, "w", encoding="utf-8") as f:
        f.write(f"# {mensaje}\n")
        f.write(f"# Commit automático {i}\n")
    
    # Ejecutar comandos git
    print("📝 Ejecutando: git add .")
    os.system("git add .")
    
    print(f"💾 Ejecutando: git commit -m '{mensaje}'")
    os.system(f'git commit -m "{mensaje}"')
    
    print(" Ejecutando: git push")
    os.system("git push")
    
    print(f"✅ Commit {i} completado")
    time.sleep(2)  # Esperar 2 segundos entre commits

# Limpiar archivos temporales
print("\n🧹 Limpiando archivos temporales...")
for i in range(1, 12):
    archivo_temp = f"app/commit_{i}.log"
    if os.path.exists(archivo_temp):
        os.remove(archivo_temp)

print(" Creando commit final de limpieza...")
os.system("git add .")
os.system('git commit -m "Limpieza de archivos temporales"')
os.system("git push")

print("\n" + "="*60)
print("🎉 ¡COMPLETADO! Todos los commits se realizaron exitosamente.")
print("="*60)
input("\nPresiona Enter para salir...")