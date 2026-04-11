import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Recipes
export const getRecipes = (params) => API.get('/recipes', { params });
export const getRecipe = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post('/recipes', data);
export const rateRecipe = (id, score) => API.post(`/recipes/${id}/rate`, { score });
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);