from sqlalchemy.orm import Session
from app.models.paciente import Paciente
from app.schemas.paciente import PacienteCreate

class PacienteRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_paciente_by_cedula(self, cedula: str):
        return self.db.query(Paciente).filter(Paciente.cedula == cedula).first()
    
    def get_paciente_by_id(self, paciente_id: int):
        return self.db.query(Paciente).filter(Paciente.id == paciente_id).first()
    
    def get_all_pacientes(self):
        return self.db.query(Paciente).all()
    
    def create_paciente(self, paciente: PacienteCreate):
        db_paciente = Paciente(**paciente.model_dump())
        self.db.add(db_paciente)
        self.db.commit()
        self.db.refresh(db_paciente)
        return db_paciente
    
    def update_paciente(self, paciente_id: int, paciente_data: dict):
        db_paciente = self.get_paciente_by_id(paciente_id)
        if db_paciente:
            for key, value in paciente_data.items():
                setattr(db_paciente, key, value)
            self.db.commit()
            self.db.refresh(db_paciente)
        return db_paciente
    
    def delete_paciente(self, paciente_id: int):
        db_paciente = self.get_paciente_by_id(paciente_id)
        if db_paciente:
            self.db.delete(db_paciente)
            self.db.commit()
            return True
        return False
