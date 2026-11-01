import { apiRequest } from './client';

export const fetchServices = () => apiRequest('/services');
