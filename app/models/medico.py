from sqlalchemy import Column, Integer, String
from app.database import Base

class Medico(Base):
    __tablename__ = "medicos"
    
    id = Column(Integer, primary_key=True, index=True)
    cedula = Column(String(10), unique=True, index=True, nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    especialidad = Column(String(100), nullable=False)
    registro_profesional = Column(String(50), unique=True)
