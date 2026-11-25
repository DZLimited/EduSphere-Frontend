import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSectionsByCourseApi, createSectionApi, deleteSectionApi } from '../../api/sectionApi';
import { createLectureApi, deleteLectureApi } from '../../api/lectureApi';

export const fetchCurriculum = createAsyncThunk('curriculum/fetch', async (courseId, { rejectWithValue }) => {
  try {
    const { data } = await getSectionsByCourseApi(courseId);
    return data.data; // array of sections, each with nested `lectures`
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load curriculum');
  }
});

export const addSection = createAsyncThunk('curriculum/addSection', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createSectionApi(payload); // { course, title }
    return { ...data.data, lectures: [] };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add section');
  }
});

export const removeSection = createAsyncThunk('curriculum/removeSection', async (id, { rejectWithValue }) => {
  try {
    await deleteSectionApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete section');
  }
});

export const addLecture = createAsyncThunk('curriculum/addLecture', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createLectureApi(payload); // { section, title, videoUrl, duration, isPreview }
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add lecture');
  }
});

export const removeLecture = createAsyncThunk('curriculum/removeLecture', async ({ id, sectionId }, { rejectWithValue }) => {
  try {
    await deleteLectureApi(id);
    return { id, sectionId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete lecture');
  }
});

const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState: {
    sections: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurriculum: (state) => {
      state.sections = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurriculum.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCurriculum.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchCurriculum.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })

      .addCase(removeSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((s) => s._id !== action.payload);
      })

      .addCase(addLecture.fulfilled, (state, action) => {
        const section = state.sections.find((s) => s._id === action.payload.section);
        if (section) section.lectures.push(action.payload);
      })

      .addCase(removeLecture.fulfilled, (state, action) => {
        const section = state.sections.find((s) => s._id === action.payload.sectionId);
        if (section) section.lectures = section.lectures.filter((l) => l._id !== action.payload.id);
      });
  },
});

export const { clearCurriculum } = curriculumSlice.actions;
export default curriculumSlice.reducer;