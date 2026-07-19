from pydantic import BaseModel
from typing import Optional
from datetime import date

class PacienteBase(BaseModel):
    cedula: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
    tipo_sangre: Optional[str] = None
    alergias: Optional[str] = None

class PacienteCreate(PacienteBase):
    pass

class PacienteResponse(PacienteBase):
    id: int
    
    class Config:
        from_attributes = True
