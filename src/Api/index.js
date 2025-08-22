import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5228/api/',
  timeout: 150000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;