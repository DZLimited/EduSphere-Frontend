import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCouponsApi, createCouponApi, toggleCouponApi, deleteCouponApi, validateCouponApi } from '../../api/couponApi';

export const fetchCoupons = createAsyncThunk('coupon/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAllCouponsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load coupons');
  }
});

export const createCoupon = createAsyncThunk('coupon/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createCouponApi(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create coupon');
  }
});

export const toggleCoupon = createAsyncThunk('coupon/toggle', async (id, { rejectWithValue }) => {
  try {
    const { data } = await toggleCouponApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle coupon');
  }
});

export const deleteCoupon = createAsyncThunk('coupon/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteCouponApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete coupon');
  }
});

export const validateCoupon = createAsyncThunk('coupon/validate', async ({ code, courseIds }, { rejectWithValue }) => {
  try {
    const { data } = await validateCouponApi(code, courseIds);
    return data.data; // { discountPercent, code }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid coupon');
  }
});

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    items: [],
    appliedCoupon: null, // { discountPercent, code } once validated at checkout
    loading: false,
    error: null,
  },
  reducers: {
    clearAppliedCoupon: (state) => { state.appliedCoupon = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => { state.loading = true; })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createCoupon.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createCoupon.rejected, (state, action) => { state.error = action.payload; })

      .addCase(toggleCoupon.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })

      .addCase(validateCoupon.fulfilled, (state, action) => { state.appliedCoupon = action.payload; })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.appliedCoupon = null;
        state.error = action.payload;
      });
  },
});

export const { clearAppliedCoupon } = couponSlice.actions;
export default couponSlice.reducer;