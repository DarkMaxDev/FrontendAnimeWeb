import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Este "interceptor" pega el token automáticamente en cada petición si existe
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;