from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Consulta(Base):
    __tablename__ = "consultas"
    
    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"), unique=True)
    diagnostico = Column(Text)
    evolucion = Column(Text)
    fecha = Column(DateTime, default=datetime.utcnow)
    
    cita = relationship("Cita")
    prescripciones = relationship("Prescripcion", back_populates="consulta")
    ordenes_medicas = relationship("OrdenMedica", back_populates="consulta")

class Prescripcion(Base):
    __tablename__ = "prescripciones"
    
    id = Column(Integer, primary_key=True, index=True)
    consulta_id = Column(Integer, ForeignKey("consultas.id"))
    medicamento = Column(String(255), nullable=False)
    dosis = Column(String(100))
    frecuencia = Column(String(100))
    duracion = Column(String(100))
    
    consulta = relationship("Consulta", back_populates="prescripciones")

class OrdenMedica(Base):
    __tablename__ = "ordenes_medicas"
    
    id = Column(Integer, primary_key=True, index=True)
    consulta_id = Column(Integer, ForeignKey("consultas.id"))
    tipo_examen = Column(String(100))
    descripcion = Column(Text)
    indicaciones = Column(Text)
    
    consulta = relationship("Consulta", back_populates="ordenes_medicas")
