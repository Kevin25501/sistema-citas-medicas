from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class EstadoCitaEnum(str, Enum):
    PENDIENTE = "pendiente"
    ATENDIDA = "atendida"
    CANCELADA = "cancelada"
    NO_ASISTIO = "no_asistio"

class CitaBase(BaseModel):
    paciente_id: int
    medico_id: int
    fecha: str
    hora: str
    motivo: Optional[str] = None

class CitaCreate(CitaBase):
    pass

class CitaResponse(CitaBase):
    id: int
    estado: EstadoCitaEnum
    created_at: datetime
    
    class Config:
        from_attributes = True
