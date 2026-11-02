// 週曆資料 API
import { apiRequest } from './client';

export const fetchAvailability = ({ from, to, durationMin }) =>
  apiRequest('/availability', { params: { from, to, durationMin } });
