import os
import re

def buscar_endpoints(ruta_carpeta):
    """Busca todos los endpoints en archivos Python"""
    print("="*70)
    print("🔍 BUSCADOR DE ENDPOINTS - T02.03 Backend")
    print("="*70)
    
    endpoints = []
    
    # Recorrer todos los archivos .py
    for raiz, dirs, archivos in os.walk(ruta_carpeta):
        for archivo in archivos:
            if archivo.endswith('.py'):
                ruta_completa = os.path.join(raiz, archivo)
                
                try:
                    with open(ruta_completa, 'r', encoding='utf-8') as f:
                        contenido = f.read()
                        
                        # Buscar patrones como @app.post("/algo") o @router.post("/algo")
                        patrones = [
                            r'@app\.post\(["\'](/[^"\']+)["\']',
                            r'@router\.post\(["\'](/[^"\']+)["\']',
                            r'@app\.get\(["\'](/[^"\']+)["\']',
                            r'@router\.get\(["\'](/[^"\']+)["\']',
                        ]
                        
                        for patron in patrones:
                            matches = re.findall(patron, contenido)
                            for match in matches:
                                # Determinar el método HTTP
                                if '.post(' in patron:
                                    metodo = 'POST'
                                else:
                                    metodo = 'GET'
                                
                                endpoints.append({
                                    'archivo': os.path.relpath(ruta_completa, ruta_carpeta),
                                    'ruta': match,
                                    'metodo': metodo
                                })
                
                except Exception as e:
                    pass
    
    # Mostrar resultados
    print(f"\n Total de endpoints encontrados: {len(endpoints)}\n")
    
    # Agrupar por tipo
    posts = [e for e in endpoints if e['metodo'] == 'POST']
    gets = [e for e in endpoints if e['metodo'] == 'GET']
    
    print("🔵 ENDPOINTS POST (para crear datos):")
    print("-" * 70)
    if posts:
        for i, ep in enumerate(posts, 1):
            print(f"{i}. {ep['ruta']}")
            print(f"   📁 Archivo: {ep['archivo']}")
            print()
    else:
        print("   No se encontraron endpoints POST\n")
    
    print("\n🟢 ENDPOINTS GET (para leer datos):")
    print("-" * 70)
    if gets:
        for i, ep in enumerate(gets, 1):
            print(f"{i}. {ep['ruta']}")
            print(f"   📁 Archivo: {ep['archivo']}")
            print()
    else:
        print("   No se encontraron endpoints GET\n")
    
    # Buscar específicamente endpoints de autenticación/usuarios
    print("\n ENDPOINTS RELACIONADOS CON USUARIOS/AUTENTICACIÓN:")
    print("-" * 70)
    auth_keywords = ['login', 'register', 'auth', 'usuario', 'user', 'signup', 'token']
    auth_endpoints = []
    
    for ep in endpoints:
        for keyword in auth_keywords:
            if keyword.lower() in ep['ruta'].lower():
                auth_endpoints.append(ep)
                break
    
    if auth_endpoints:
        for ep in auth_endpoints:
            print(f"• {ep['metodo']} {ep['ruta']}")
            print(f"  📁 {ep['archivo']}")
            print()
    else:
        print("   No se encontraron endpoints relacionados con usuarios\n")
    
    print("="*70)
    print("💡 SUGERENCIA:")
    print("="*70)
    if posts:
        print("Para registrar un usuario, prueba con uno de estos endpoints POST:")
        for i, ep in enumerate(posts[:3], 1):  # Mostrar los primeros 3
            print(f"\n{i}. curl -X POST https://sistema-citas-medicas-k58b.onrender.com{ep['ruta']} \\")
            print(f"   -H \"Content-Type: application/json\" \\")
            print(f"   -d \"{{\\\"username\\\":\\\"kevin\\\",\\\"password\\\":\\\"123456\\\"}}\"")
    
    print("\n" + "="*70)

if __name__ == "__main__":
    # Buscar en la carpeta app
    ruta_backend = "app"
    
    if os.path.exists(ruta_backend):
        buscar_endpoints(ruta_backend)
    else:
        print(f" Error: No se encontró la carpeta '{ruta_backend}'")
        print("Asegúrate de ejecutar este script desde la carpeta 'Proyecto Uni'")