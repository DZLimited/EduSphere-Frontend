import axiosInstance from './axiosInstance';

export const sendLinkRequestApi = (childEmail) => axiosInstance.post('/parents/link-requests', { childEmail });
export const getMyLinkRequestsApi = () => axiosInstance.get('/parents/link-requests');
export const respondToLinkRequestApi = (id, action) => axiosInstance.put(`/parents/link-requests/${id}`, { action });
export const getMyChildrenApi = () => axiosInstance.get('/parents/children');
export const getChildProgressApi = (childId) => axiosInstance.get(`/parents/children/${childId}/progress`);