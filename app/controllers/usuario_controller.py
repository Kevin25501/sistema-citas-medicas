from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, LoginRequest
from app.services.usuario_service import UsuarioService

router = APIRouter()

@router.post("/registro", response_model=UsuarioResponse)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    service = UsuarioService(db)
    try:
        return service.registrar_usuario(usuario)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    service = UsuarioService(db)
    try:
        return service.login(login_data.username, login_data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
