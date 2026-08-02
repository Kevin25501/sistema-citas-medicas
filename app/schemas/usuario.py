from pydantic import BaseModel, ConfigDict

class UsuarioBase(BaseModel):
    username: str
    perfil_id: int

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int
    estado: bool
    
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    username: str  # 
    password: str