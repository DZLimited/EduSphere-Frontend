import axiosInstance from './axiosInstance';

export const askQuestionApi = (data) => axiosInstance.post('/discussions', data);
export const getCourseDiscussionsApi = (courseId) => axiosInstance.get(`/discussions/course/${courseId}`);
export const getTeacherDiscussionsApi = () => axiosInstance.get('/discussions/teacher');
export const answerQuestionApi = (id, answer) => axiosInstance.put(`/discussions/${id}/answer`, { answer });