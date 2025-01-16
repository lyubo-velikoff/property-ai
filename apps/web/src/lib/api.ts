import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Return the entire response data
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token but don't redirect - let the auth context handle navigation
      localStorage.removeItem('token');
      return Promise.reject(new Error('Unauthorized - Please log in'));
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error - Please check your connection'));
    }
    
    // Handle other API errors
    const errorMessage = error.response.data?.message || 'An error occurred';
    console.error('API Error:', {
      status: error.response.status,
      message: errorMessage,
      path: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api; 
