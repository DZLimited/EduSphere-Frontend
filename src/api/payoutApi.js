import axiosInstance from './axiosInstance';

export const requestPayoutApi = (amount) => axiosInstance.post('/payouts', { amount });
export const getMyPayoutsApi = () => axiosInstance.get('/payouts/my');
export const getAllPayoutsApi = () => axiosInstance.get('/payouts');
export const approvePayoutApi = (id) => axiosInstance.put(`/payouts/${id}/approve`);
export const rejectPayoutApi = (id) => axiosInstance.put(`/payouts/${id}/reject`);