from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class PacienteBase(BaseModel):
    cedula: str = Field(..., min_length=10, max_length=10)
    nombres: str = Field(..., min_length=3, max_length=100)
    apellidos: str = Field(..., min_length=3, max_length=100)
    fecha_nacimiento: date
    telefono: Optional[str] = Field(None, min_length=10, max_length=15)
    direccion: Optional[str] = Field(None, max_length=255)
    correo: Optional[EmailStr] = None
    tipo_sangre: Optional[str] = Field(None, max_length=5)
    alergias: Optional[str] = Field(None, max_length=255)