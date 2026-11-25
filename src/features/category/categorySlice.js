import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoriesApi, createCategoryApi, deleteCategoryApi } from '../../api/categoryApi';

export const fetchCategories = createAsyncThunk('category/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getCategoriesApi();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load categories');
  }
});

export const addCategory = createAsyncThunk('category/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createCategoryApi(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create category');
  }
});

export const removeCategory = createAsyncThunk('category/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteCategoryApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => { state.error = action.payload; })

      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })
      .addCase(removeCategory.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default categorySlice.reducer;