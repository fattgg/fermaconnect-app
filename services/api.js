import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login',    data),
  me:       ()      => api.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById:            (id)     => api.get(`/products/${id}`),
  create:             (data)   => api.post('/products',                   data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:             (id, data) => api.put(`/products/${id}`,            data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove:             (id)     => api.delete(`/products/${id}`),
  toggleAvailability: (id)     => api.patch(`/products/${id}/availability`),
};

export const ordersAPI = {
  create:       (data) => api.post('/orders',              data),
  getAll:       ()     => api.get('/orders'),
  getById:      (id)   => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const farmersAPI = {
  getProfile:  (id) => api.get(`/farmers/${id}`),
  getProducts: (id) => api.get(`/farmers/${id}/products`),
};

export default api;