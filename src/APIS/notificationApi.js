import { API } from '../apiConfig';
// Notifications
export const createNotification = (data) => API.post('/api/notifications', data);
export const getNotifications = () => API.get('/api/notifications');
export const markNotificationAsRead = (ids) => API.put(`/api/mark_notifications/read`, ids);