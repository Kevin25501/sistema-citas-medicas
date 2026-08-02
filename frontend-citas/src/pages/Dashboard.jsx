import { useEffect, useState } from 'react';
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
