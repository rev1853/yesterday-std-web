import axios from 'axios';

const api = axios.create({
  baseURL: 'https://capstone-dtei.um.ac.id/yesterday-std-backend/public/api',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
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
