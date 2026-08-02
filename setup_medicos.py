from app.database import SessionLocal
from app.models.medico import Medico

print("🏥 Creando médicos con datos REALISTAS...")

db = SessionLocal()

medicos_data = [
    {
        "cedula": "1712345678",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez Martínez",
        "especialidad": "Cardiología",
        "registro_profesional": "MP-2345"
    },
    {
        "cedula": "1723456789",
        "nombres": "María Fernanda",
        "apellidos": "González López",
        "especialidad": "Pediatría",
        "registro_profesional": "MP-3456"
    },
    {
        "cedula": "1734567890",
        "nombres": "Carlos Andrés",
        "apellidos": "Rodríguez Silva",
        "especialidad": "Dermatología",
        "registro_profesional": "MP-4567"
    },
    {
        "cedula": "1745678901",
        "nombres": "Ana Lucía",
        "apellidos": "Torres Ramírez",
        "especialidad": "Ginecología",
        "registro_profesional": "MP-5678"
    },
    {
        "cedula": "1756789012",
        "nombres": "Luis Alberto",
        "apellidos": "Morales Castro",
        "especialidad": "Traumatología",
        "registro_profesional": "MP-6789"
    }
]

try:
    for medico_data in medicos_data:
        existente = db.query(Medico).filter(Medico.cedula == medico_data["cedula"]).first()
        
        if not existente:
            nuevo_medico = Medico(**medico_data)
            db.add(nuevo_medico)
            db.commit()
            print(f"✅ {medico_data['nombres']} {medico_data['apellidos']} - {medico_data['especialidad']}")
        else:
            print(f"⚠️  {medico_data['nombres']} {medico_data['apellidos']} ya existe")
    
    print("\n🎉 ¡Médicos creados exitosamente!")
    print("🔄 Recarga tu dashboard (F5) para verlos")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    db.close()