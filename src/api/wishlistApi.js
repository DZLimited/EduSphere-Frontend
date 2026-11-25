import axiosInstance from './axiosInstance';

export const getWishlistApi = () => axiosInstance.get('/wishlist');
export const addToWishlistApi = (courseId) => axiosInstance.post(`/wishlist/${courseId}`);
export const removeFromWishlistApi = (courseId) => axiosInstance.delete(`/wishlist/${courseId}`);