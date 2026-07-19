from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.paciente import PacienteCreate, PacienteResponse
from app.services.paciente_service import PacienteService

router = APIRouter()

@router.get("/", response_model=List[PacienteResponse])
def obtener_todos_pacientes(db: Session = Depends(get_db)):
    service = PacienteService(db)
    return service.obtener_todos()

@router.get("/{paciente_id}", response_model=PacienteResponse)
def obtener_paciente(paciente_id: int, db: Session = Depends(get_db)):
    service = PacienteService(db)
    try:
        return service.obtener_por_id(paciente_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=PacienteResponse)
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    service = PacienteService(db)
    try:
        return service.crear_paciente(paciente)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
