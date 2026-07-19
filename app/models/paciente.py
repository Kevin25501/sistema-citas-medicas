from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Paciente(Base):
    __tablename__ = "pacientes"
    
    id = Column(Integer, primary_key=True, index=True)
    cedula = Column(String(10), unique=True, index=True, nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    telefono = Column(String(15))
    direccion = Column(String(255))
    correo = Column(String(100))
    tipo_sangre = Column(String(5))
    alergias = Column(String(255))
