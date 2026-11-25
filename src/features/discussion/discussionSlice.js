import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  askQuestionApi,
  getCourseDiscussionsApi,
  getTeacherDiscussionsApi,
  answerQuestionApi,
} from '../../api/discussionApi';

export const fetchCourseDiscussions = createAsyncThunk('discussion/fetchCourse', async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await getCourseDiscussionsApi(courseId);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load questions');
  }
});

export const askQuestion = createAsyncThunk('discussion/ask', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await askQuestionApi(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit question');
  }
});

export const fetchTeacherDiscussions = createAsyncThunk('discussion/fetchTeacher', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getTeacherDiscussionsApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load questions');
  }
});

export const answerQuestion = createAsyncThunk('discussion/answer', async ({ id, answer }, { rejectWithValue }) => {
  try {
    const { data } = await answerQuestionApi(id, answer);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit answer');
  }
});

const discussionSlice = createSlice({
  name: 'discussion',
  initialState: {
    courseItems: [],   // Q&A shown on a course page
    teacherItems: [],   // teacher's full Q&A inbox
    loading: false,
    error: null,
  },
  reducers: {
    clearCourseDiscussions: (state) => { state.courseItems = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseDiscussions.fulfilled, (state, action) => { state.courseItems = action.payload; })

      .addCase(askQuestion.fulfilled, (state, action) => { state.courseItems.unshift(action.payload); })
      .addCase(askQuestion.rejected, (state, action) => { state.error = action.payload; })

      .addCase(fetchTeacherDiscussions.pending, (state) => { state.loading = true; })
      .addCase(fetchTeacherDiscussions.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherItems = action.payload;
      })
      .addCase(fetchTeacherDiscussions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(answerQuestion.fulfilled, (state, action) => {
        const idx = state.teacherItems.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.teacherItems[idx] = action.payload;
      });
  },
});

export const { clearCourseDiscussions } = discussionSlice.actions;
export default discussionSlice.reducer;