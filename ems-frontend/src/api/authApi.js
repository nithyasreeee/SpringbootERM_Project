import axios from 'axios';

const BASE_URL = 'http://localhost:8080/auth';

export const register = (data) => axios.post(`${BASE_URL}/register`, data);
export const login = (data) => axios.post(`${BASE_URL}/login`, data);
