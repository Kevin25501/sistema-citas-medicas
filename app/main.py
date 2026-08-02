import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.controllers import (
    usuario_controller,
    paciente_controller,
    medico_controller,
    cita_controller
)

logger = logging.getLogger("uvicorn.error")

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

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Red de seguridad global: sin esto, cualquier excepción no controlada (ej. errores
    de base de datos) genera un 500 que NO pasa por CORSMiddleware, y el navegador lo
    bloquea mostrando "Network Error" en vez del error real. Con este handler, el error
    sí lleva headers CORS y el frontend puede leer el mensaje real.
    """
    logger.error(f"Error no controlado en {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor. Revisa los logs del backend para más detalle."}
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