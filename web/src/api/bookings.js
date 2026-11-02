// 預約相關 API：建立、取消、查看自己的預約
import { apiRequest } from './client';

export const createBooking = (body) => apiRequest('/bookings', { method: 'POST', body });

export const cancelBooking = ({ id, token }) =>
  apiRequest(`/bookings/${id}`, { method: 'DELETE', params: { token } });

export const fetchMyBookings = () => apiRequest('/me/bookings');
