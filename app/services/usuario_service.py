from sqlalchemy.orm import Session
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, LoginRequest
from app.security.password_handler import verify_password
from app.security.jwt_handler import create_access_token

class UsuarioService:
    def __init__(self, db: Session):
        self.repository = UsuarioRepository(db)
    
    def registrar_usuario(self, usuario: UsuarioCreate) -> UsuarioResponse:
        existente = self.repository.get_usuario_by_username(usuario.username)
        if existente:
            raise ValueError("El username ya está registrado")
        
        usuario_db = self.repository.create_usuario(usuario)
        return UsuarioResponse.from_orm(usuario_db)
    
    def login(self, username: str, password: str):
        usuario = self.repository.get_usuario_by_username(username)
        if not usuario:
            raise ValueError("Credenciales inválidas")
        
        if not verify_password(password, usuario.password_hash):
            raise ValueError("Credenciales inválidas")
        
        if not usuario.estado:
            raise ValueError("Usuario inactivo")
        
        access_token = create_access_token(data={"sub": usuario.username, "id": usuario.id})
        return {"access_token": access_token, "token_type": "bearer"}
