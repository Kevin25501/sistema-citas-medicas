import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/api/usuarios/login', { username, password });
  return response.data;
};

export const getMedicos = async () => {
  const response = await api.get('/api/medicos');
  return response.data;
};

export const crearCita = async (citaData) => {
  const response = await api.post('/api/citas/', citaData);
  return response.data;
};

export default api;


export const getMisCitas = async () => {
  const response = await api.get('/api/citas/');
  return response.data;
};