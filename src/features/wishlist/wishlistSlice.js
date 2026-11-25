import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getWishlistApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (course, { rejectWithValue }) => {
  try {
    await addToWishlistApi(course._id);
    return course;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (courseId, { rejectWithValue }) => {
  try {
    await removeFromWishlistApi(courseId);
    return courseId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;