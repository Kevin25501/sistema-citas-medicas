import React, { useState, useEffect } from 'react';
import { getMisCitas } from '../services/api';

export default function MisCitas() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await getMisCitas();
        setCitas(data);
      } catch (error) {
        console.error("Error al cargar citas", error);
      }
    };
    fetchCitas();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Mis Citas Agendadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citas.length > 0 ? citas.map(cita => (
          <div key={cita.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800">{cita.medico?.nombres} {cita.medico?.apellidos}</h3>
            <p className="text-gray-600 text-sm">{cita.medico?.especialidad}</p>
            <div className="mt-4 text-sm text-gray-700">
              <p>📅 Fecha: {cita.fecha}</p>
              <p>⏰ Hora: {cita.hora}</p>
              <p className="mt-2 italic">{cita.motivo}</p>
            </div>
          </div>
        )) : <p className="text-gray-500">No tienes citas agendadas aún.</p>}
      </div>
    </div>
  );
}