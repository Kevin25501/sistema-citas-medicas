from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class EstadoCita(str, enum.Enum):
    PENDIENTE = "pendiente"
    ATENDIDA = "atendida"
    CANCELADA = "cancelada"
    NO_ASISTIO = "no_asistio"

class Cita(Base):
    __tablename__ = "citas"
    
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id = Column(Integer, ForeignKey("medicos.id"), nullable=False)
    fecha = Column(String(10), nullable=False)
    hora = Column(String(5), nullable=False)
    motivo = Column(String(255))
    estado = Column(SQLEnum(EstadoCita), default=EstadoCita.PENDIENTE)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    paciente = relationship("Paciente")
    medico = relationship("Medico")
