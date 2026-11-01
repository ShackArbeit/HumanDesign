import { apiRequest } from './client';

export const fetchContent = (section) => apiRequest(`/content/${section}`);
export const fetchAboutTimeline = () => apiRequest('/about/timeline');
export const fetchFeedbackVideos = () => apiRequest('/feedback/videos');
