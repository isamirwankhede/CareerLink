import api from './api';

export const createCompany = (data) => api.post('/company', data);
export const getCompanies = () => api.get('/company');
export const getCompany = (id) => api.get(`/company/${id}`);
export const updateCompany = (id, data) => api.put(`/company/${id}`, data);
