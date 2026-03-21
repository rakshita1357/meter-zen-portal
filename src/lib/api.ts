import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('ww_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // returning response object to access headers if needed, usually data is enough but let's see
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('ww_token');
      sessionStorage.removeItem('ww_auth');
      // Ideally we should redirect to login here but let's handle it in AuthContext or components
    }
    return Promise.reject(error);
  }
);

export default api;

