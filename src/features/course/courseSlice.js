import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMyCoursesApi,
  createCourseApi,
  submitCourseApi,
  deleteCourseApi,
} from '../../api/courseApi';

export const fetchMyCourses = createAsyncThunk('course/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMyCoursesApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load your courses');
  }
});

export const createCourse = createAsyncThunk('course/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createCourseApi(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create course');
  }
});

export const submitCourse = createAsyncThunk('course/submit', async (id, { rejectWithValue }) => {
  try {
    const { data } = await submitCourseApi(id);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit course');
  }
});

export const deleteCourse = createAsyncThunk('course/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteCourseApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete course');
  }
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    items: [],       // teacher's own courses
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => { state.error = action.payload; })

      .addCase(submitCourse.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default courseSlice.reducer;