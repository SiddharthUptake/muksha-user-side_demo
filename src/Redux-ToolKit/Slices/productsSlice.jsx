import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';
import { fetchUserProfile } from './UserProfileSlice';

// Async action for fetching all products
export const fetchAllProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(`${baseUrl}/getAllProduct`);
  return response.data;
});

// Async action for fetching products by sub-category ID
export const fetchProductsBySubCategoryId = createAsyncThunk(
  'products/fetchProductsBySubCategoryId',
  async (subCategoryId) => {
    const response = await axios.get(`${baseUrl}/getProductByCategoryId/${subCategoryId}`);
    return response.data.products;  // adjust this path according to your API response structure
  }
);

// Async action for fetching products by collection name
export const fetchProductsByCollectionId = createAsyncThunk(
  "products/fetchByCollection",
  async (collectionId, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/getProductByCollectionId/${collectionId}`);
      return response.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);




const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProducts: [],
    productsByCollection: [], 
    favoriteProducts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchAllProducts actions
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handling fetchProductsBySubCategoryId actions
      .addCase(fetchProductsBySubCategoryId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsBySubCategoryId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProducts = action.payload;  // Storing the fetched products by sub-category
      })
      .addCase(fetchProductsBySubCategoryId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handling fetchProductsByCollectionName actions
      .addCase(fetchProductsByCollectionId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCollectionId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productsByCollection = action.payload; // Storing the fetched products by collection
      })
      .addCase(fetchProductsByCollectionId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
     
     
  },
});

export default productsSlice.reducer;
