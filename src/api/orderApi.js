import axiosInstance from './axiosInstance';

export const checkoutApi = (courseIds, couponCode) => axiosInstance.post('/orders', { courseIds, couponCode });
export const getMyOrdersApi = () => axiosInstance.get('/orders/my');