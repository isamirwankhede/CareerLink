import api from './api';

export const applyForJob = (jobId, data) => api.post(`/apply/${jobId}`, data);
export const getUserApplications = () => api.get('/applications');
export const getAdminApplicants = () => api.get('/applications/admin');
export const getJobApplicants = (jobId) => api.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) =>
  api.put(`/application/status/${id}`, { status });
