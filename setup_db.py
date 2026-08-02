from app.database import SessionLocal, Base, engine
from app.models.usuario import Perfil, Usuario
from app.security.password_handler import hash_password

print("🔄 Sincronizando base de datos...")
# Esto crea las tablas si no existen (por si acaso)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 1. Asegurar que exista el perfil con ID 1
    perfil = db.query(Perfil).filter(Perfil.id == 1).first()
    if not perfil:
        perfil = Perfil(id=1, nombre="Admin", descripcion="Administrador del sistema")
        db.add(perfil)
        db.commit()
        print("✅ Perfil 'Admin' (ID: 1) creado.")
    else:
        print("✅ Perfil (ID: 1) ya existe.")

    # 2. Crear el usuario de prueba
    usuario = db.query(Usuario).filter(Usuario.username == "kevin").first()
    if not usuario:
        nuevo_usuario = Usuario(
            username="kevin",
            password_hash=hash_password("123456"),
            perfil_id=1,
            estado=True
        )
        db.add(nuevo_usuario)
        db.commit()
        print("✅ Usuario 'kevin' creado exitosamente.")
    else:
        print("✅ Usuario 'kevin' ya existe.")

    print("\n🎉 ¡BASE DE DATOS LISTA!")
    print("🚀 Ahora ve a http://localhost:5173/")
    print("👤 Usuario: kevin")
    print("🔑 Contraseña: 123456")

except Exception as e:
    print(f"❌ Error: {e}")
finally:
    db.close()