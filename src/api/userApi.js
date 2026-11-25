import axiosInstance from './axiosInstance';

export const getAllUsersApi = (params) => axiosInstance.get('/users', { params });
export const blockUserApi = (id) => axiosInstance.put(`/users/${id}/block`);
export const unblockUserApi = (id) => axiosInstance.put(`/users/${id}/unblock`);
export const deleteUserApi = (id) => axiosInstance.delete(`/users/${id}`);