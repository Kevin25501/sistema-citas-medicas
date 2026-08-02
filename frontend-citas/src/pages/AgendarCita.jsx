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
      await crearCita({ medico_id: Number(medicoId), fecha, hora, motivo });
      setMensaje('✅ Cita agendada exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMensaje('❌ Error al agendar la cita');
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