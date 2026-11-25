import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPendingCoursesApi, approveCourseApi, rejectCourseApi } from '../../api/adminApi';
import { getAllUsersApi, blockUserApi, unblockUserApi, deleteUserApi } from '../../api/userApi';

export const fetchPendingCourses = createAsyncThunk('admin/fetchPending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getPendingCoursesApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load pending courses');
  }
});

export const approveCourse = createAsyncThunk('admin/approve', async (id, { rejectWithValue }) => {
  try {
    await approveCourseApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to approve course');
  }
});

export const rejectCourse = createAsyncThunk('admin/reject', async ({ id, reason }, { rejectWithValue }) => {
  try {
    await rejectCourseApi(id, reason);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reject course');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingCourses: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPendingCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCourses = action.payload;
      })
      .addCase(fetchPendingCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(approveCourse.fulfilled, (state, action) => {
        state.pendingCourses = state.pendingCourses.filter((c) => c._id !== action.payload);
      })

      .addCase(rejectCourse.fulfilled, (state, action) => {
        state.pendingCourses = state.pendingCourses.filter((c) => c._id !== action.payload);
      })
.addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(blockUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(unblockUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const { data } = await getAllUsersApi(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load users');
  }
});

export const blockUser = createAsyncThunk('admin/blockUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await blockUserApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to block user');
  }
});

export const unblockUser = createAsyncThunk('admin/unblockUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await unblockUserApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to unblock user');
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
  }
});