import axiosInstance from './axiosInstance';

export const getPendingCoursesApi = () => axiosInstance.get('/admin/courses/pending');
export const getAllCoursesAdminApi = () => axiosInstance.get('/admin/courses');
export const approveCourseApi = (id) => axiosInstance.put(`/admin/courses/${id}/approve`);
export const rejectCourseApi = (id, reason) => axiosInstance.put(`/admin/courses/${id}/reject`, { reason });