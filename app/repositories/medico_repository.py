from sqlalchemy.orm import Session
from app.models.medico import Medico
from app.schemas.medico import MedicoCreate

class MedicoRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_medico_by_cedula(self, cedula: str):
        return self.db.query(Medico).filter(Medico.cedula == cedula).first()
    
    def get_medico_by_id(self, medico_id: int):
        return self.db.query(Medico).filter(Medico.id == medico_id).first()
    
    def get_all_medicos(self):
        return self.db.query(Medico).all()
    
    def create_medico(self, medico: MedicoCreate):
        db_medico = Medico(**medico.model_dump())
        self.db.add(db_medico)
        self.db.commit()
        self.db.refresh(db_medico)
        return db_medico
