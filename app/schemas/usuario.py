from pydantic import BaseModel
from typing import Optional

class UsuarioBase(BaseModel):
    username: str
    perfil_id: int

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int
    estado: bool
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str
