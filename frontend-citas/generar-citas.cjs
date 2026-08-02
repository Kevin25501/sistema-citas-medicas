const fs = require('fs');
const path = require('path');

console.log('🏥 Generando módulos de Citas Médicas...\n');

// 1. Actualizar api.js
const apiPath = path.join(__dirname, 'src', 'services', 'api.js');
let apiContent = fs.readFileSync(apiPath, 'utf8');

if (!apiContent.includes('crearCita')) {
    apiContent += `

export const crearCita = async (citaData) => {
  const response = await api.post('/api/citas', citaData);
  return response.data;
};

export const getMisCitas = async () => {
  const response = await api.get('/api/citas');
  return response.data;
};`;
    fs.writeFileSync(apiPath, apiContent);
    console.log('✅ api.js actualizado con endpoints de citas.');
}

// 2. Crear AgendarCita.jsx
const agendarPath = path.join(__dirname, 'src', 'pages', 'AgendarCita.jsx');
const agendarCode = `import React, { useState, useEffect } from 'react';
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
}`;
fs.writeFileSync(agendarPath, agendarCode);
console.log('✅ AgendarCita.jsx creado.');

// 3. Crear MisCitas.jsx (AQUÍ ESTABA EL ERROR, YA CORREGIDO)
const citasPath = path.join(__dirname, 'src', 'pages', 'MisCitas.jsx');
const citasCode = `import React, { useState, useEffect } from 'react';
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
}`;
fs.writeFileSync(citasPath, citasCode);
console.log('✅ MisCitas.jsx creado.');

// 4. Actualizar App.jsx para agregar rutas
const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('AgendarCita')) {
    appContent = appContent.replace(
        "import Dashboard from './pages/Dashboard';",
        "import Dashboard from './pages/Dashboard';\nimport AgendarCita from './pages/AgendarCita';\nimport MisCitas from './pages/MisCitas';"
    );
    appContent = appContent.replace(
        '<Route path="/dashboard" element={<Dashboard />} />',
        '<Route path="/dashboard" element={<Dashboard />} />\n          <Route path="/agendar" element={<AgendarCita />} />\n          <Route path="/mis-citas" element={<MisCitas />} />'
    );
    fs.writeFileSync(appPath, appContent);
    console.log('✅ App.jsx actualizado con nuevas rutas.');
}

// 5. Actualizar Dashboard.jsx para agregar botones
const dashPath = path.join(__dirname, 'src', 'pages', 'Dashboard.jsx');
let dashContent = fs.readFileSync(dashPath, 'utf8');

if (!dashContent.includes('/agendar')) {
    // Buscamos el cierre del componente para insertar los botones antes
    dashContent = dashContent.replace(
        'return (\n    <div className="p-8">',
        'return (\n    <div className="p-8">\n      <div className="mt-8 flex gap-4 justify-center mb-8">\n        <a href="/agendar" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow">+ Agendar Cita</a>\n        <a href="/mis-citas" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow">Ver Mis Citas</a>\n      </div>'
    );
    fs.writeFileSync(dashPath, dashContent);
    console.log('✅ Dashboard.jsx actualizado con botones de navegación.');
}

console.log('\n🎉 ¡Módulo de Citas generado exitosamente!');