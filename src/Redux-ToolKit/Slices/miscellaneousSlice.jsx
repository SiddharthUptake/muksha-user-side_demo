import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action for fetching color by its ID
export const fetchColorById = createAsyncThunk(
  "miscellaneous/fetchColorById",
  async (colorId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getColor/${colorId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action for fetching size by its ID
export const fetchSizeById = createAsyncThunk(
  "miscellaneous/fetchSizeById",
  async (sizeId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getSize/${sizeId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the miscellaneous slice
const initialState = {
  colors: [],
  sizes: [],
  status: "idle",
  error: null,
};

const miscellaneousSlice = createSlice({
  name: "miscellaneous",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColorById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchColorById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.colors.push(action.payload.color);
      })
      .addCase(fetchColorById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSizeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSizeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sizes.push(action.payload.size);
      })
      .addCase(fetchSizeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default miscellaneousSlice.reducer;
