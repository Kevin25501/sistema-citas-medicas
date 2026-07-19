from pydantic import BaseModel
from typing import Optional

class MedicoBase(BaseModel):
    cedula: str
    nombres: str
    apellidos: str
    especialidad: str
    registro_profesional: Optional[str] = None

class MedicoCreate(MedicoBase):
    pass

class MedicoResponse(MedicoBase):
    id: int
    
    class Config:
        from_attributes = True
