from sqlalchemy.orm import Session
from app.repositories.paciente_repository import PacienteRepository
from app.schemas.paciente import PacienteCreate, PacienteResponse

class PacienteService:
    def __init__(self, db: Session):
        self.repository = PacienteRepository(db)
    
    def obtener_todos(self):
        pacientes = self.repository.get_all_pacientes()
        return [PacienteResponse.from_orm(p) for p in pacientes]
    
    def obtener_por_id(self, paciente_id: int):
        paciente = self.repository.get_paciente_by_id(paciente_id)
        if not paciente:
            raise ValueError("Paciente no encontrado")
        return PacienteResponse.from_orm(paciente)
    
    def crear_paciente(self, paciente: PacienteCreate):
        existente = self.repository.get_paciente_by_cedula(paciente.cedula)
        if existente:
            raise ValueError("La cédula ya está registrada")
        
        paciente_db = self.repository.create_paciente(paciente)
        return PacienteResponse.from_orm(paciente_db)
    
    def actualizar_paciente(self, paciente_id: int, paciente_data: dict):
        paciente = self.repository.update_paciente(paciente_id, paciente_data)
        if not paciente:
            raise ValueError("Paciente no encontrado")
        return PacienteResponse.from_orm(paciente)
    
    def eliminar_paciente(self, paciente_id: int):
        if not self.repository.delete_paciente(paciente_id):
            raise ValueError("Paciente no encontrado")
        return {"mensaje": "Paciente eliminado correctamente"}
