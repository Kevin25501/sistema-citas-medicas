from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Comprobante(Base):
    __tablename__ = "comprobantes"
    
    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"))
    tipo = Column(String(50), nullable=False)
    monto = Column(Float, nullable=False)
    iva = Column(Float, default=0)
    total = Column(Float, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    
    cita = relationship("Cita")
    transacciones = relationship("Transaccion", back_populates="comprobante")

class Transaccion(Base):
    __tablename__ = "transacciones"
    
    id = Column(Integer, primary_key=True, index=True)
    comprobante_id = Column(Integer, ForeignKey("comprobantes.id"))
    tipo = Column(String(50), nullable=False)
    cuenta_contable = Column(String(20))
    monto = Column(Float, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    
    comprobante = relationship("Comprobante", back_populates="transacciones")
