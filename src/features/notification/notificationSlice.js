import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyNotificationsApi, markAsReadApi, markAllAsReadApi } from '../../api/notificationApi';

export const fetchNotifications = createAsyncThunk('notification/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyNotificationsApi();
    return data; // { data: [...], unreadCount }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load notifications');
  }
});

export const markAsRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try {
    await markAsReadApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const markAllAsRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await markAllAsReadApi();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state) => { state.loading = false; })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.items.find((n) => n._id === action.payload);
        if (n && !n.isRead) {
          n.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((n) => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;