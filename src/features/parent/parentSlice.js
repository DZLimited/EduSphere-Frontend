import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  sendLinkRequestApi,
  getMyLinkRequestsApi,
  respondToLinkRequestApi,
  getMyChildrenApi,
  getChildProgressApi,
} from '../../api/parentApi';

export const sendLinkRequest = createAsyncThunk('parent/sendRequest', async (childEmail, { rejectWithValue }) => {
  try {
    const { data } = await sendLinkRequestApi(childEmail);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send request');
  }
});

export const fetchMyLinkRequests = createAsyncThunk('parent/fetchRequests', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyLinkRequestsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load requests');
  }
});

export const respondToLinkRequest = createAsyncThunk('parent/respond', async ({ id, action }, { rejectWithValue }) => {
  try {
    await respondToLinkRequestApi(id, action);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to respond');
  }
});

export const fetchMyChildren = createAsyncThunk('parent/fetchChildren', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyChildrenApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load children');
  }
});

export const fetchChildProgress = createAsyncThunk('parent/fetchChildProgress', async (childId, { rejectWithValue }) => {
  try {
    const { data } = await getChildProgressApi(childId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load progress');
  }
});

const parentSlice = createSlice({
  name: 'parent',
  initialState: {
    linkRequests: [],   // pending requests, student's view
    children: [],        // approved children, parent's view
    childProgress: [],    // one child's enrollments, parent's view
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLinkRequests.fulfilled, (state, action) => { state.linkRequests = action.payload; })

      .addCase(respondToLinkRequest.fulfilled, (state, action) => {
        state.linkRequests = state.linkRequests.filter((r) => r._id !== action.payload);
      })

      .addCase(fetchMyChildren.pending, (state) => { state.loading = true; })
      .addCase(fetchMyChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchMyChildren.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchChildProgress.fulfilled, (state, action) => {
        state.childProgress = action.payload;
      })

      .addCase(sendLinkRequest.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default parentSlice.reducer;