import axios from 'axios';

const BASE_URL = 'https://web-production-e3406.up.railway.app/api/employees';

export const getAllEmployees = () => axios.get(BASE_URL);
export const getEmployeeById = (id) => axios.get(`${BASE_URL}/${id}`);
export const saveEmployee = (data) => axios.post(BASE_URL, data);
export const updateEmployee = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${BASE_URL}/${id}`);