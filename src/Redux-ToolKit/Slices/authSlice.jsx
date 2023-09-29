import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// user register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/auth', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || { favorites: [] },
  localFavorites: JSON.parse(localStorage.getItem('localFavorites')) || [],
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addToFavorites(state, action) {
      if (!state.isAuthenticated) {
        state.localFavorites.push(action.payload);
        localStorage.setItem('localFavorites', JSON.stringify(state.localFavorites));
      } else {
        state.user.favorites.push(action.payload);
      }
    },
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      if (action.payload.isVerified) {
        state.isVerified = true;
      }
    },
    [registerUser.rejected]: (state, action) => {
      state.error = action.payload.message;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    [loginUser.rejected]: (state, action) => {
      state.error = action.payload.message;
    },
  }
});

export const { clearError, logout, addToFavorites } = authSlice.actions;
export default authSlice.reducer;
