from sqlalchemy.orm import Session
from app.repositories.cita_repository import CitaRepository
from app.schemas.cita import CitaCreate, CitaResponse, EstadoCitaEnum

class CitaService:
    def __init__(self, db: Session):
        self.repository = CitaRepository(db)
    
    def obtener_todas(self):
        citas = self.repository.get_all_citas()
        return [CitaResponse.from_orm(c) for c in citas]
    
    def obtener_por_cedula_paciente(self, cedula: str):
        citas = self.repository.get_citas_by_paciente_cedula(cedula)
        return [CitaResponse.from_orm(c) for c in citas]
    
    def agendar_cita(self, cita: CitaCreate):
        cita_db = self.repository.create_cita(cita)
        return CitaResponse.from_orm(cita_db)
    
    def cancelar_cita(self, cita_id: int):
        cita = self.repository.update_estado_cita(cita_id, EstadoCitaEnum.CANCELADA)
        if not cita:
            raise ValueError("Cita no encontrada")
        return CitaResponse.from_orm(cita)
