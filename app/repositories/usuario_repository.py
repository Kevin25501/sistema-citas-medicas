from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate
from app.security.password_handler import hash_password

class UsuarioRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_usuario_by_username(self, username: str):
        return self.db.query(Usuario).filter(Usuario.username == username).first()
    
    def get_usuario_by_id(self, usuario_id: int):
        return self.db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    def create_usuario(self, usuario: UsuarioCreate):
        db_usuario = Usuario(
            username=usuario.username,
            password_hash=hash_password(usuario.password),
            perfil_id=usuario.perfil_id
        )
        self.db.add(db_usuario)
        self.db.commit()
        self.db.refresh(db_usuario)
        return db_usuario
