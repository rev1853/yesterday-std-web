import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const setAuthToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }
};

// Initialize with token if present
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (token) {
  setAuthToken(token);
}

export default api;
