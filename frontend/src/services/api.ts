import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students
export const getStudents = () => apiClient.get('/students');
export const getStudentById = (id: string) => apiClient.get(`/students/${id}`);
export const createStudent = (data: unknown) => apiClient.post('/students', data);
export const updateStudent = (id: string, data: unknown) => apiClient.put(`/students/${id}`, data);
export const deleteStudent = (id: string) => apiClient.delete(`/students/${id}`);

// Admins
export const getAdmins = () => apiClient.get('/admins');
export const getAdminById = (id: string) => apiClient.get(`/admins/${id}`);
export const createAdmin = (data: unknown) => apiClient.post('/admins', data);
export const updateAdmin = (id: string, data: unknown) => apiClient.put(`/admins/${id}`, data);
export const deleteAdmin = (id: string) => apiClient.delete(`/admins/${id}`);

export default apiClient;
