import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/course/courseSlice';
import cartReducer from '../features/cart/cartSlice';
import enrollmentReducer from '../features/enrollment/enrollmentSlice';
import notificationReducer from '../features/notification/notificationSlice';
import categoryReducer from '../features/category/categorySlice';
import curriculumReducer from '../features/curriculum/curriculumSlice';
import adminReducer from '../features/admin/adminSlice';
import reviewReducer from '../features/review/reviewSlice';
import parentReducer from '../features/parent/parentSlice';
import couponReducer from '../features/coupon/couponSlice';
import payoutReducer from '../features/payout/payoutSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import discussionReducer from '../features/discussion/discussionSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    category: categoryReducer,
    course: courseReducer,
    curriculum: curriculumReducer,
    cart: cartReducer,
    enrollment: enrollmentReducer,
    notification: notificationReducer,
    review: reviewReducer,
    parent: parentReducer,
    coupon: couponReducer,
    payout: payoutReducer,
    wishlist: wishlistReducer,
    discussion: discussionReducer,
 },
});
