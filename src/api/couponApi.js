import axiosInstance from './axiosInstance';

export const getAllCouponsApi = () => axiosInstance.get('/coupons');
export const createCouponApi = (data) => axiosInstance.post('/coupons', data);
export const toggleCouponApi = (id) => axiosInstance.put(`/coupons/${id}/toggle`);
export const deleteCouponApi = (id) => axiosInstance.delete(`/coupons/${id}`);
export const validateCouponApi = (code, courseIds) => axiosInstance.post('/coupons/validate', { code, courseIds });