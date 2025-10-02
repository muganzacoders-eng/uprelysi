import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://educationapi-n33q.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async (token) => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const googleAuth = async (payload) => {
  const response = await api.post('/auth/google', payload);
  return response.data;
};


