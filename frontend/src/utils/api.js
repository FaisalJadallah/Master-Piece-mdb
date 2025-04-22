import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create an axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle token expiration
    if (error.response?.status === 401) {
      console.log('Authentication error detected, checking if token exists');
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Token exists but resulted in 401 - might be expired or invalid');
        
        // Only redirect to login if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          console.log('Redirecting to login page due to authentication error');
          // Optionally clear local storage
          // localStorage.clear();
          // window.location.href = '/login';
        }
      }
    }
    
    // Handle 404 errors
    if (error.response?.status === 404) {
      console.log(`Resource not found: ${error.config?.url}`);
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (credentials) => {
  return api.post('/users/login', credentials);
};

export const registerUser = (userData) => {
  return api.post('/users/register', userData);
};

export const verifyAdmin = () => {
  return api.get('/users/verify-admin');
};

export const getCurrentUserProfile = () => {
  return api.get('/users/profile');
};

// User APIs
export const getAllUsers = () => {
  return api.get('/users');
};

export const updateUserRole = (userId, role) => {
  return api.put(`/users/${userId}/role`, { role });
};

export const deleteUser = (userId) => {
  return api.delete(`/users/${userId}`);
};

// Tournament APIs
export const getAllTournaments = () => {
  return api.get('/tournaments');
};

export const getTournamentById = (id) => {
  return api.get(`/tournaments/${id}`);
};

export const createTournament = (tournamentData) => {
  return api.post('/tournaments', tournamentData);
};

export const updateTournament = (id, tournamentData) => {
  return api.put(`/tournaments/${id}`, tournamentData);
};

export const deleteTournament = (id) => {
  return api.delete(`/tournaments/${id}`);
};

export const registerForTournament = (id, participantData) => {
  return api.post(`/tournaments/${id}/register`, participantData);
};

export const getTournamentParticipants = (id) => {
  return api.get(`/tournaments/${id}/participants`);
};

// Store/Product APIs - supporting both endpoints
export const getAllProducts = (queryParams) => {
  // Try both endpoints with fallback
  return api.get('/store', { params: queryParams })
    .catch(error => {
      // If store endpoint fails, try products endpoint
      if (error.response?.status === 404) {
        console.log('Store endpoint not found, trying products endpoint');
        return api.get('/products', { params: queryParams });
      }
      throw error;
    });
};

export const getProductById = (id) => {
  return api.get(`/store/${id}`)
    .catch(error => {
      // If store endpoint fails, try products endpoint
      if (error.response?.status === 404) {
        console.log('Store product endpoint not found, trying products endpoint');
        return api.get(`/products/${id}`);
      }
      throw error;
    });
};

export const createProduct = (productData) => {
  return api.post('/store', productData)
    .catch(error => {
      // If store endpoint fails, try products endpoint
      if (error.response?.status === 404) {
        console.log('Store create endpoint not found, trying products endpoint');
        return api.post('/products', productData);
      }
      throw error;
    });
};

export const updateProduct = (id, productData) => {
  return api.put(`/store/${id}`, productData)
    .catch(error => {
      // If store endpoint fails, try products endpoint
      if (error.response?.status === 404) {
        console.log('Store update endpoint not found, trying products endpoint');
        return api.put(`/products/${id}`, productData);
      }
      throw error;
    });
};

export const deleteProduct = (id) => {
  return api.delete(`/store/${id}`)
    .catch(error => {
      // If store endpoint fails, try products endpoint
      if (error.response?.status === 404) {
        console.log('Store delete endpoint not found, trying products endpoint');
        return api.delete(`/products/${id}`);
      }
      throw error;
    });
};

export const updateUserProfile = (formData) => {
  return api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default api; 