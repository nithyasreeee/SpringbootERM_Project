import axios from 'axios';

const BASE_URL = 'https://web-production-e3406.up.railway.app/auth';

export const register = (data) => axios.post(`${BASE_URL}/register`, data);
export const login = (data) => axios.post(`${BASE_URL}/login`, data);
export const getAllUsers = () => axios.get(`${BASE_URL}/users`);
export const updateUserRole = (id, role) =>
  axios.put(`${BASE_URL}/users/${id}/role`, { role });