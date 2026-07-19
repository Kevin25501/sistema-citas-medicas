from sqlalchemy.orm import Session
from app.repositories.medico_repository import MedicoRepository
from app.schemas.medico import MedicoCreate, MedicoResponse

class MedicoService:
    def __init__(self, db: Session):
        self.repository = MedicoRepository(db)
    
    def obtener_todos(self):
        medicos = self.repository.get_all_medicos()
        return [MedicoResponse.from_orm(m) for m in medicos]
    
    def obtener_por_id(self, medico_id: int):
        medico = self.repository.get_medico_by_id(medico_id)
        if not medico:
            raise ValueError("Médico no encontrado")
        return MedicoResponse.from_orm(medico)
    
    def crear_medico(self, medico: MedicoCreate):
        existente = self.repository.get_medico_by_cedula(medico.cedula)
        if existente:
            raise ValueError("La cédula ya está registrada")
        
        medico_db = self.repository.create_medico(medico)
        return MedicoResponse.from_orm(medico_db)
