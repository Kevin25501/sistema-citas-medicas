from sqlalchemy.orm import Session
from app.models.cita import Cita, EstadoCita
from app.schemas.cita import CitaCreate
from datetime import datetime

class CitaRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_cita_by_id(self, cita_id: int):
        return self.db.query(Cita).filter(Cita.id == cita_id).first()
    
    def get_all_citas(self):
        return self.db.query(Cita).all()
    
    def get_citas_by_paciente_cedula(self, cedula: str):
        return self.db.query(Cita).join(Cita.paciente).filter(Cita.paciente.has(cedula=cedula)).all()
    
    def create_cita(self, cita: CitaCreate):
        db_cita = Cita(**cita.model_dump())
        self.db.add(db_cita)
        self.db.commit()
        self.db.refresh(db_cita)
        return db_cita
    
    def update_estado_cita(self, cita_id: int, estado: EstadoCita):
        db_cita = self.get_cita_by_id(cita_id)
        if db_cita:
            db_cita.estado = estado
            self.db.commit()
            self.db.refresh(db_cita)
        return db_cita
