import axiosInstance from './axiosInstance';

export const getCourseReviewsApi = (courseId) => axiosInstance.get(`/reviews/course/${courseId}`);
export const createReviewApi = (data) => axiosInstance.post('/reviews', data);
export const deleteReviewApi = (id) => axiosInstance.delete(`/reviews/${id}`);