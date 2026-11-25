import axiosInstance from './axiosInstance';

export const getCoursesApi = (params) => axiosInstance.get('/courses', { params });
export const getCourseByIdApi = (id) => axiosInstance.get(`/courses/${id}`);
export const getMyCoursesApi = () => axiosInstance.get('/courses/my-courses');
export const createCourseApi = (data) => axiosInstance.post('/courses', data);
export const updateCourseApi = (id, data) => axiosInstance.put(`/courses/${id}`, data);
export const submitCourseApi = (id) => axiosInstance.put(`/courses/${id}/submit`);
export const deleteCourseApi = (id) => axiosInstance.delete(`/courses/${id}`);