import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('centralconnect_user');
  if (stored) {
    const parsed = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

export default api;
