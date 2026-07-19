from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PrescripcionBase(BaseModel):
    medicamento: str
    dosis: Optional[str] = None
    frecuencia: Optional[str] = None
    duracion: Optional[str] = None

class OrdenMedicaBase(BaseModel):
    tipo_examen: Optional[str] = None
    descripcion: Optional[str] = None
    indicaciones: Optional[str] = None

class ConsultaBase(BaseModel):
    cita_id: int
    diagnostico: Optional[str] = None
    evolucion: Optional[str] = None

class ConsultaCreate(ConsultaBase):
    prescripciones: Optional[List[PrescripcionBase]] = []
    ordenes_medicas: Optional[List[OrdenMedicaBase]] = []

class ConsultaResponse(ConsultaBase):
    id: int
    fecha: datetime
    
    class Config:
        from_attributes = True
