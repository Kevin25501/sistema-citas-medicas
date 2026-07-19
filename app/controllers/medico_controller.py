from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.medico import MedicoCreate, MedicoResponse
from app.services.medico_service import MedicoService

router = APIRouter()

@router.get("/", response_model=List[MedicoResponse])
def obtener_todos_medicos(db: Session = Depends(get_db)):
    service = MedicoService(db)
    return service.obtener_todos()

@router.get("/{medico_id}", response_model=MedicoResponse)
def obtener_medico(medico_id: int, db: Session = Depends(get_db)):
    service = MedicoService(db)
    try:
        return service.obtener_por_id(medico_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=MedicoResponse)
def crear_medico(medico: MedicoCreate, db: Session = Depends(get_db)):
    service = MedicoService(db)
    try:
        return service.crear_medico(medico)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
