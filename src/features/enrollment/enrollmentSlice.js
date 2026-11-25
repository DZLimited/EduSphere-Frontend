import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyEnrollmentsApi, checkEnrollmentApi } from '../../api/enrollmentApi';
import { checkoutApi } from '../../api/orderApi';

export const fetchMyEnrollments = createAsyncThunk('enrollment/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyEnrollmentsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load your courses');
  }
});

export const checkIfEnrolled = createAsyncThunk('enrollment/check', async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await checkEnrollmentApi(courseId);
    return data.isEnrolled;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to check enrollment');
  }
});

export const checkout = createAsyncThunk('enrollment/checkout', async ({ courseIds, couponCode }, { rejectWithValue }) => {
  try {
    const { data } = await checkoutApi(courseIds, couponCode);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Checkout failed');
  }
});

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: {
    items: [],           // enrolled courses (My Learning)
    isEnrolledInCurrent: false, // used on CourseDetails page
    loading: false,
    checkoutLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(checkIfEnrolled.fulfilled, (state, action) => {
        state.isEnrolledInCurrent = action.payload;
      })

      .addCase(checkout.pending, (state) => { state.checkoutLoading = true; state.error = null; })
      .addCase(checkout.fulfilled, (state) => { state.checkoutLoading = false; })
      .addCase(checkout.rejected, (state, action) => { state.checkoutLoading = false; state.error = action.payload; });
  },
});

export default enrollmentSlice.reducer;