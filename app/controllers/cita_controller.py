from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.cita import CitaCreate, CitaResponse
from app.services.cita_service import CitaService

router = APIRouter()

@router.get("/", response_model=List[CitaResponse])
def obtener_todas_citas(db: Session = Depends(get_db)):
    service = CitaService(db)
    return service.obtener_todas()

@router.get("/paciente/{cedula}", response_model=List[CitaResponse])
def obtener_citas_por_cedula(cedula: str, db: Session = Depends(get_db)):
    service = CitaService(db)
    return service.obtener_por_cedula_paciente(cedula)

@router.post("/", response_model=CitaResponse)
def agendar_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    service = CitaService(db)
    try:
        return service.agendar_cita(cita)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{cita_id}/cancelar", response_model=CitaResponse)
def cancelar_cita(cita_id: int, db: Session = Depends(get_db)):
    service = CitaService(db)
    try:
        return service.cancelar_cita(cita_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
