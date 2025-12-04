import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Attach token to known API domain
      if (config.url?.startsWith(config.baseURL || 'https://dummyjson.com') || config.url?.startsWith('/') || !config.url?.startsWith('http')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRedirecting) {
        isRedirecting = true;
        
        // Clean up localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        toast.error("Session expired. Please login again.");
        
        if (!window.location.hash.includes('login')) {
          setTimeout(() => {
             window.location.hash = '#/login';
             isRedirecting = false;
          }, 1000);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;