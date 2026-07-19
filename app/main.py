from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.controllers import (
    usuario_controller,
    paciente_controller,
    medico_controller,
    cita_controller
)

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestión de Citas Médicas",
    description="API para gestión de citas médicas del Consultorio San Rafael",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(usuario_controller.router, prefix="/api/usuarios", tags=["Usuarios"])
app.include_router(paciente_controller.router, prefix="/api/pacientes", tags=["Pacientes"])
app.include_router(medico_controller.router, prefix="/api/medicos", tags=["Médicos"])
app.include_router(cita_controller.router, prefix="/api/citas", tags=["Citas"])

@app.get("/")
def root():
    return {
        "mensaje": "Sistema de Gestión de Citas Médicas - Consultorio San Rafael",
        "version": "1.0.0",
        "documentacion": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}