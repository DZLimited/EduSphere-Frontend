import axiosInstance from './axiosInstance';

export const getSectionsByCourseApi = (courseId) => axiosInstance.get(`/sections/course/${courseId}`);
export const createSectionApi = (data) => axiosInstance.post('/sections', data);
export const updateSectionApi = (id, data) => axiosInstance.put(`/sections/${id}`, data);
export const deleteSectionApi = (id) => axiosInstance.delete(`/sections/${id}`);