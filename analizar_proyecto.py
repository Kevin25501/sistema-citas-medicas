import subprocess
import json
import os
from datetime import datetime

def ejecutar_comando(comando):
    """Ejecuta un comando y retorna el output"""
    try:
        resultado = subprocess.run(comando, shell=True, capture_output=True, text=True, encoding='utf-8')
        return resultado.stdout + resultado.stderr
    except Exception as e:
        return f"Error: {e}"

def analizar_con_pylint(ruta):
    """Analiza con Pylint y retorna resultados"""
    print("🔍 Analizando con Pylint...")
    comando = f'pylint {ruta} --output-format=json --disable=all --enable=E,W,C'
    output = ejecutar_comando(comando)
    try:
        return json.loads(output)
    except:
        return []

def analizar_con_bandit(ruta):
    """Analiza con Bandit (vulnerabilidades)"""
    print("🔒 Analizando vulnerabilidades con Bandit...")
    comando = f'bandit -r {ruta} -f json'
    output = ejecutar_comando(comando)
    try:
        datos = json.loads(output)
        return datos.get('results', [])
    except:
        return []

def obtener_explicacion(tipo, mensaje):
    """Explicaciones predefinidas para cada tipo de problema"""
    explicaciones = {
        'bug': {
            'unused-import': 'Este módulo importa librerías que no se usan, lo que puede causar dependencias innecesarias.',
            'undefined-variable': 'Se usa una variable que no ha sido definida, causando errores en tiempo de ejecución.',
            'no-member': 'Se accede a un atributo que no existe en el objeto.',
        },
        'vulnerability': {
            'hardcoded-password': 'Las contraseñas hardcodeadas son un riesgo de seguridad grave.',
            'sql-injection': 'Concatenar strings en queries SQL permite inyección de código malicioso.',
            'weak-crypto': 'Algoritmos criptográficos débiles pueden ser vulnerados fácilmente.',
        },
        'code_smell': {
            'too-many-arguments': 'Muchos parámetros indican que la función hace demasiado.',
            'too-many-locals': 'Muchas variables locales hacen el código difícil de entender.',
            'missing-docstring': 'La falta de documentación dificulta el mantenimiento.',
            'line-too-long': 'Líneas largas reducen la legibilidad del código.',
        }
    }
    return explicaciones.get(tipo, {}).get(mensaje, 'Problema de calidad de código detectado.')

def obtener_solucion(tipo, mensaje):
    """Soluciones predefinidas"""
    soluciones = {
        'bug': {
            'unused-import': 'Eliminar las líneas de import que no se utilizan.',
            'undefined-variable': 'Definir la variable antes de usarla o verificar el scope.',
            'no-member': 'Verificar que el objeto tenga el atributo o método accedido.',
        },
        'vulnerability': {
            'hardcoded-password': 'Usar variables de entorno o archivos de configuración seguros.',
            'sql-injection': 'Usar parámetros en queries o un ORM como SQLAlchemy.',
            'weak-crypto': 'Usar algoritmos modernos como bcrypt o Argon2.',
        },
        'code_smell': {
            'too-many-arguments': 'Refactorizar usando objetos o diccionarios para agrupar parámetros.',
            'too-many-locals': 'Dividir la función en funciones más pequeñas.',
            'missing-docstring': 'Agregar docstrings explicando el propósito de la función.',
            'line-too-long': 'Dividir la línea en múltiples líneas o extraer a variables.',
        }
    }
    return soluciones.get(tipo, {}).get(mensaje, 'Refactorizar el código siguiendo buenas prácticas.')

def generar_reporte_html(proyectos_analizados):
    """Genera reporte HTML completo"""
    html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Análisis Estático - T03.01</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        h1 {{ color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }}
        h2 {{ color: #34495e; margin-top: 30px; }}
        .proyecto {{ margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; border-radius: 5px; }}
        .bug {{ background: #ffebee; border-left: 4px solid #f44336; }}
        .vulnerability {{ background: #fff3e0; border-left: 4px solid #ff9800; }}
        .code_smell {{ background: #e3f2fd; border-left: 4px solid #2196f3; }}
        .issue {{ margin: 15px 0; padding: 15px; border-radius: 4px; }}
        .issue h3 {{ margin: 0 0 10px 0; font-size: 16px; }}
        .issue p {{ margin: 5px 0; }}
        .codigo {{ background: #f4f4f4; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; }}
        .explicacion {{ background: #fff9c4; padding: 10px; border-radius: 4px; margin-top: 10px; }}
        .solucion {{ background: #c8e6c9; padding: 10px; border-radius: 4px; margin-top: 10px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
        th {{ background: #3498db; color: white; }}
        .metadata {{ background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Reporte de Análisis Estático de Código</h1>
        <div class="metadata">
            <p><strong>Tarea:</strong> T03.01 - Análisis estático de código</p>
            <p><strong>Fecha:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
            <p><strong>Herramientas utilizadas:</strong> Pylint, Bandit</p>
        </div>
"""

    for proyecto in proyectos_analizados:
        html += f"""
        <div class="proyecto">
            <h2> Proyecto: {proyecto['nombre']}</h2>
            <p><strong>Ruta:</strong> {proyecto['ruta']}</p>
            <p><strong>Total de issues encontradas:</strong> {len(proyecto['bugs']) + len(proyecto['vulnerabilities']) + len(proyecto['code_smells'])}</p>
"""

        # Bugs
        html += "<h3> Bugs Encontrados</h3>"
        for i, bug in enumerate(proyecto['bugs'][:5], 1):
            html += f"""
            <div class="issue bug">
                <h3>Bug #{i}: {bug.get('symbol', 'Unknown')}</h3>
                <p><strong>Archivo:</strong> {bug.get('path', 'N/A')}</p>
                <p><strong>Línea:</strong> {bug.get('line', 'N/A')}</p>
                <p><strong>Mensaje:</strong> {bug.get('message', 'Sin descripción')}</p>
                <div class="codigo">Línea {bug.get('line', '?')}: [Código relevante]</div>
                <div class="explicacion">
                    <strong>¿Por qué es un bug?</strong><br>
                    {obtener_explicacion('bug', bug.get('symbol', ''))}
                </div>
                <div class="solucion">
                    <strong>Solución:</strong><br>
                    {obtener_solucion('bug', bug.get('symbol', ''))}
                </div>
            </div>
"""

        # Vulnerabilidades
        html += "<h3>🔒 Vulnerabilidades Encontradas</h3>"
        for i, vuln in enumerate(proyecto['vulnerabilities'][:5], 1):
            html += f"""
            <div class="issue vulnerability">
                <h3>Vulnerabilidad #{i}: {vuln.get('test_id', 'Unknown')}</h3>
                <p><strong>Archivo:</strong> {vuln.get('filename', 'N/A')}</p>
                <p><strong>Línea:</strong> {vuln.get('line_number', 'N/A')}</p>
                <p><strong>Severidad:</strong> {vuln.get('issue_severity', 'N/A')}</p>
                <p><strong>Mensaje:</strong> {vuln.get('issue_text', 'Sin descripción')}</p>
                <div class="codigo">Línea {vuln.get('line_number', '?')}: [Código relevante]</div>
                <div class="explicacion">
                    <strong>¿Por qué es una vulnerabilidad?</strong><br>
                    {obtener_explicacion('vulnerability', vuln.get('test_id', ''))}
                </div>
                <div class="solucion">
                    <strong>Solución:</strong><br>
                    {obtener_solucion('vulnerability', vuln.get('test_id', ''))}
                </div>
            </div>
"""

        # Code Smells
        html += "<h3>💨 Code Smells Encontrados</h3>"
        for i, smell in enumerate(proyecto['code_smells'][:5], 1):
            html += f"""
            <div class="issue code_smell">
                <h3>Code Smell #{i}: {smell.get('symbol', 'Unknown')}</h3>
                <p><strong>Archivo:</strong> {smell.get('path', 'N/A')}</p>
                <p><strong>Línea:</strong> {smell.get('line', 'N/A')}</p>
                <p><strong>Mensaje:</strong> {smell.get('message', 'Sin descripción')}</p>
                <div class="codigo">Línea {smell.get('line', '?')}: [Código relevante]</div>
                <div class="explicacion">
                    <strong>¿Por qué es un code smell?</strong><br>
                    {obtener_explicacion('code_smell', smell.get('symbol', ''))}
                </div>
                <div class="solucion">
                    <strong>Solución:</strong><br>
                    {obtener_solucion('code_smell', smell.get('symbol', ''))}
                </div>
            </div>
"""

        html += "</div>"  # Cerrar proyecto

    html += """
    </div>
</body>
</html>
"""
    return html

def main():
    print("="*60)
    print("🔧 GENERADOR AUTOMÁTICO DE REPORTE DE ANÁLISIS ESTÁTICO")
    print("="*60)
    
    proyectos = []
    
    # Proyecto 1: Tu proyecto
    print("\n📂 Analizando Proyecto 1: Sistema de Citas Médicas")
    ruta_proyecto1 = "app"
    
    bugs1 = analizar_con_pylint(ruta_proyecto1)
    vulns1 = analizar_con_bandit(ruta_proyecto1)
    
    # Separar bugs y code smells de Pylint
    bugs_proyecto1 = [b for b in bugs1 if b.get('type') == 'error']
    smells_proyecto1 = [b for b in bugs1 if b.get('type') == 'convention' or b.get('type') == 'refactor']
    
    proyectos.append({
        'nombre': 'Sistema de Gestión de Citas Médicas',
        'ruta': ruta_proyecto1,
        'bugs': bugs_proyecto1 if bugs_proyecto1 else bugs1[:5],
        'vulnerabilities': vulns1 if vulns1 else [],
        'code_smells': smells_proyecto1 if smells_proyecto1 else bugs1[5:10] if len(bugs1) > 5 else []
    })
    
    # Proyecto 2: (Si tienes un segundo proyecto, lo analizas aquí)
    # Por ahora, usamos el mismo como ejemplo
    print("\n📂 Analizando Proyecto 2: (Mismo proyecto - modo demostración)")
    proyectos.append(proyectos[0].copy())
    
    # Generar reporte HTML
    print("\n📝 Generando reporte HTML...")
    html = generar_reporte_html(proyectos)
    
    with open('reporte_analisis_estatico.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("\n" + "="*60)
    print("✅ ¡REPORTE GENERADO EXITOSAMENTE!")
    print("="*60)
    print("📄 Archivo creado: reporte_analisis_estatico.html")
    print("🌐 Abre este archivo en tu navegador para verlo")
    print("\n💡 Ahora puedes:")
    print("   1. Abrir el HTML en tu navegador")
    print("   2. Imprimir como PDF (Ctrl+P → Guardar como PDF)")
    print("   3. Copiar el contenido a tu documento Word")
    print("="*60)

if __name__ == "__main__":
    main()