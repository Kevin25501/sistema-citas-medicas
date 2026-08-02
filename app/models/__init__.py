"""
Importa todos los modelos aquí para que, sin importar qué script o
módulo se ejecute primero (main.py, setup_db.py, vincular_paciente.py,
etc.), SQLAlchemy siempre tenga registradas TODAS las tablas en
Base.metadata antes de llamar a create_all().

Por qué es necesario: create_all() solo puede crear/resolver una
llave foránea hacia una tabla si el modelo de esa tabla ya fue
importado en algún punto (eso es lo que registra la Table en
Base.metadata). Antes de este cambio, un script que solo importaba
`app.models.usuario` (como setup_db.py) fallaba con
`NoReferencedTableError: ... could not find table 'pacientes'` en
cuanto `usuarios` obtuvo una FK hacia `pacientes`, porque Python
nunca había cargado ese módulo.
"""
from app.models.usuario import Usuario, Perfil
from app.models.paciente import Paciente
from app.models.medico import Medico
from app.models.cita import Cita, EstadoCita
from app.models.consulta import Consulta, Prescripcion, OrdenMedica
from app.models.comprobante import Comprobante, Transaccion

__all__ = [
    "Usuario",
    "Perfil",
    "Paciente",
    "Medico",
    "Cita",
    "EstadoCita",
    "Consulta",
    "Prescripcion",
    "OrdenMedica",
    "Comprobante",
    "Transaccion",
]
