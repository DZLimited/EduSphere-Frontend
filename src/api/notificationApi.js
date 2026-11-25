import axiosInstance from './axiosInstance';

export const getMyNotificationsApi = () => axiosInstance.get('/notifications');
export const markAsReadApi = (id) => axiosInstance.put(`/notifications/${id}/read`);
export const markAllAsReadApi = () => axiosInstance.put('/notifications/read-all');