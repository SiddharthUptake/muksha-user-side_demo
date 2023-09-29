import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // assuming you're using axios

export const fetchAllCollections = createAsyncThunk(
  "collections/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getCollections`);
      return response.data.allCollection;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const collectionSlice = createSlice({
  name: "collections",
  initialState: [],
  reducers: {},
  extraReducers: {
    [fetchAllCollections.fulfilled]: (state, action) => {
      return action.payload;
    },
  },
});

export default collectionSlice.reducer;
