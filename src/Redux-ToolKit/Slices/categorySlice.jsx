import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk to fetch categories using axios
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAllCategories',
  async () => {
    const response = await axios.get('http://localhost:8000/user/getCategories');
    return response.data.categories;
  }
);

// Define the initial state and reducers using createSlice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {},
  extraReducers: {
    [fetchAllCategories.fulfilled]: (state, action) => {
      return action.payload;
    }
  }
});

export default categoriesSlice.reducer;
