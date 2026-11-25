import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCourseReviewsApi, createReviewApi, deleteReviewApi } from '../../api/reviewApi';

export const fetchCourseReviews = createAsyncThunk('review/fetch', async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await getCourseReviewsApi(courseId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load reviews');
  }
});

export const submitReview = createAsyncThunk('review/submit', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createReviewApi(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
  }
});

export const removeReview = createAsyncThunk('review/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteReviewApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
  }
});

const reviewSlice = createSlice({
  name: 'review',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearReviews: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourseReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(submitReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => { state.error = action.payload; })

      .addCase(removeReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;