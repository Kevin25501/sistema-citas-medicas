import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicos, crearCita } from '../services/api';

export default function AgendarCita() {
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const data = await getMedicos();
        setMedicos(data);
      } catch (error) {
        console.error("Error al cargar médicos", error);
      }
    };
    fetchMedicos();
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      // Decodificar el token para obtener el paciente_id vinculado a este usuario.
      // OJO: payload.id es el ID de la cuenta de LOGIN (tabla usuarios), NO el ID
      // del paciente (tabla pacientes). Son entidades distintas. El backend ahora
      // incluye paciente_id directamente en el token para evitar esa confusión.
      const payload = JSON.parse(atob(token.split('.')[1]));
      const pacienteId = payload.paciente_id;

      if (!pacienteId) {
        setMensaje('❌ Tu cuenta de usuario no tiene un paciente vinculado. Contacta al administrador para asociar tu registro de paciente antes de agendar.');
        return;
      }

      // Enviar la cita con el paciente_id real
      await crearCita({ 
        medico_id: Number(medicoId), 
        fecha, 
        hora, 
        motivo,
        paciente_id: Number(pacienteId)
      });
      setMensaje('✅ Cita agendada exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(d => d.msg || d).join(' | ') 
            : JSON.stringify(error.response.data.detail))
        : error.message;
      setMensaje('❌ Error: ' + errorMsg);
      console.error("Detalle del error:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Agendar Nueva Cita</h2>
        {mensaje && <p className="mb-4 text-center font-semibold">{mensaje}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Médico</label>
            <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md">
              <option value="">Seleccione un médico</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nombres} {m.apellidos} - {m.especialidad}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Motivo de consulta</label>
            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md" rows="3"></textarea>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 font-semibold">Confirmar Cita</button>
        </form>
      </div>
    </div>
  );
}