import axiosInstance from './axiosInstance';

export const getCourseProgressApi = (courseId) => axiosInstance.get(`/progress/course/${courseId}`);
export const updateLectureProgressApi = (lectureId, data) =>
  axiosInstance.put(`/progress/lecture/${lectureId}`, data);