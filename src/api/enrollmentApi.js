import axiosInstance from './axiosInstance';

export const getMyEnrollmentsApi = () => axiosInstance.get('/enrollments/my');
export const checkEnrollmentApi = (courseId) => axiosInstance.get(`/enrollments/check/${courseId}`);