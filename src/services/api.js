import axios from 'axios';

// Substitua pela URL real do seu back-end
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', 
  timeout: 10000,
  withCredentials: true 
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;