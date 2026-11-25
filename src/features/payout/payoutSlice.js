import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  requestPayoutApi,
  getMyPayoutsApi,
  getAllPayoutsApi,
  approvePayoutApi,
  rejectPayoutApi,
} from '../../api/payoutApi';
import { getMeApi } from '../../api/authApi';

export const fetchMyPayouts = createAsyncThunk('payout/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyPayoutsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load payouts');
  }
});

export const requestPayout = createAsyncThunk('payout/request', async (amount, { rejectWithValue }) => {
  try {
    const { data } = await requestPayoutApi(amount);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to request payout');
  }
});

export const fetchAllPayouts = createAsyncThunk('payout/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getAllPayoutsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load payouts');
  }
});

export const approvePayout = createAsyncThunk('payout/approve', async (id, { rejectWithValue }) => {
  try {
    const { data } = await approvePayoutApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to approve payout');
  }
});

export const rejectPayout = createAsyncThunk('payout/reject', async (id, { rejectWithValue }) => {
  try {
    const { data } = await rejectPayoutApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reject payout');
  }
});

const payoutSlice = createSlice({
  name: 'payout',
  initialState: {
    myPayouts: [],
    allPayouts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayouts.fulfilled, (state, action) => { state.myPayouts = action.payload; })
      .addCase(requestPayout.fulfilled, (state, action) => { state.myPayouts.unshift(action.payload); })
      .addCase(requestPayout.rejected, (state, action) => { state.error = action.payload; })

      .addCase(fetchAllPayouts.pending, (state) => { state.loading = true; })
      .addCase(fetchAllPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayouts = action.payload;
      })
      .addCase(fetchAllPayouts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(approvePayout.fulfilled, (state, action) => {
        const idx = state.allPayouts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.allPayouts[idx] = action.payload;
      })
      .addCase(rejectPayout.fulfilled, (state, action) => {
        const idx = state.allPayouts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.allPayouts[idx] = action.payload;
      });
  },
});

export default payoutSlice.reducer;