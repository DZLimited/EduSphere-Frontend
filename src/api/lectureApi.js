import axiosInstance from './axiosInstance';

export const getLectureByIdApi = (id) => axiosInstance.get(`/lectures/${id}`);
export const createLectureApi = (data) => axiosInstance.post('/lectures', data);
export const updateLectureApi = (id, data) => axiosInstance.put(`/lectures/${id}`, data);
export const deleteLectureApi = (id) => axiosInstance.delete(`/lectures/${id}`);