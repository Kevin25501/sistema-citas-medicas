const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Crear estructura de carpetas
const dirs = ['components', 'services', 'pages'];
dirs.forEach(dir => {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Carpeta creada: src/${dir}`);
  } else {
    console.log(`⚠️  Carpeta ya existe: src/${dir}`);
  }
});

// 1. Servicio de API (conecta con tu backend de Render)
const apiService = `import axios from 'axios';

const API_BASE_URL = 'https://sistema-citas-medicas-k58b.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getMedicos = async () => {
  const response = await api.get('/medicos');
  return response.data;
};

export const crearCita = async (citaData) => {
  const response = await api.post('/citas', citaData);
  return response.data;
};

export default api;
`;

fs.writeFileSync(path.join(srcDir, 'services', 'api.js'), apiService);
console.log('✅ Servicio de API creado: src/services/api.js');

// 2. Pantalla de Login
const loginPage = `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🏥 Sistema de Citas Médicas
        </h1>
        <h2 className="text-xl text-center text-gray-600 mb-8">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'Login.jsx'), loginPage);
console.log('✅ Pantalla Login creada: src/pages/Login.jsx');

// 3. Pantalla Dashboard (Lista de Médicos)
const dashboardPage = `import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicos } from '../services/api';

function Dashboard() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const data = await getMedicos();
        setMedicos(data);
      } catch (err) {
        console.error('Error al cargar médicos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600"> Citas Médicas</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Médicos Disponibles</h2>
          <button
            onClick={() => navigate('/agendar')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            + Agendar Cita
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicos.map((medico) => (
              <div key={medico.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800">{medico.nombre}</h3>
                <p className="text-gray-600 mt-2">Especialidad: {medico.especialidad}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'Dashboard.jsx'), dashboardPage);
console.log('✅ Pantalla Dashboard creada: src/pages/Dashboard.jsx');

// 4. Pantalla Agendar Cita
const agendarPage = `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearCita } from '../services/api';

function AgendarCita() {
  const [formData, setFormData] = useState({
    medico_id: '',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCita(formData);
      setMensaje('✅ Cita agendada exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMensaje('❌ Error al agendar la cita');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Agendar Nueva Cita</h2>
        
        {mensaje && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID del Médico
            </label>
            <input
              type="number"
              name="medico_id"
              value={formData.medico_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de la consulta
            </label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="4"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
            >
              Agendar Cita
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgendarCita;
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'AgendarCita.jsx'), agendarPage);
console.log('✅ Pantalla Agendar Cita creada: src/pages/AgendarCita.jsx');

// 5. Actualizar App.jsx con React Router
const appJsx = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgendarCita from './pages/AgendarCita';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendar" element={<AgendarCita />} />
      </Routes>
    </Router>
  );
}

export default App;
`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);
console.log('✅ App.jsx actualizado con React Router');

// 6. Actualizar main.jsx
const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);
console.log('✅ main.jsx actualizado');

console.log('\n🎉 ¡SETUP COMPLETADO!');
console.log('📁 Estructura creada:');
console.log('   - src/services/api.js');
console.log('   - src/pages/Login.jsx');
console.log('   - src/pages/Dashboard.jsx');
console.log('   - src/pages/AgendarCita.jsx');
console.log('   - src/App.jsx (con Router)');
console.log('   - src/main.jsx');
console.log('\n🚀 Ejecuta: npm run dev');
console.log('🌐 Abre: http://localhost:5173/');