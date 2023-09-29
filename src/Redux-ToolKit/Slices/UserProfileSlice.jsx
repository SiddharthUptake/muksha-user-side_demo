import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8000/user/profile`,{
        headers: {
          authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async action for editing user profile
export const editUserProfile = createAsyncThunk(
  "userProfile/editUserProfile",
  async (userData, thunkAPI) => {
    const token = localStorage.getItem("token");
    // console.log(userData,"userdd")
    try {
      const response = await axios.put(`http://localhost:8000/user/editprofile`, userData, {
        headers: {
          authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async action for editing user address
export const editAddress = createAsyncThunk(
  "userProfile/editAddress",
  async ({ addressId, address }, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:8000/user/editAddress`,
        { addressId, address },
        {
          headers: {
            authorization: `${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//createaddress
export const createAddress = createAsyncThunk(
  "userProfile/createAddress",
  async (newAddress, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`http://localhost:8000/user/createAddress`, { address: newAddress }, {
        headers: {
          authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action for deleting user address
export const deleteAddress = createAsyncThunk(
  "userProfile/deleteAddress",
  async ({ userID, addressId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:8000/user/deleteAddress`,
        { userID, addressId },
        {
          headers: {
            authorization: `${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async action for fetching a product by its ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getProduct/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action for toggling a favorite product
export const toggleFavoriteProduct = createAsyncThunk(
  "userProfile/toggleFavoriteProduct",
  async ({ productId, skuId }, thunkAPI) => {
    // Retrieve token from local storage
    const token = localStorage.getItem("token");
    // console.log(token)

    console.log(productId,skuId)

    if (!token) {
      // If there's no token, you can either throw an error or handle it gracefully depending on your application's requirements.
      return thunkAPI.rejectWithValue({ message: "No token found." });
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/user/updateFavouriteProduct`,
        {
          productId: productId,
          skuId: skuId
        },
        {
          headers: {
            authorization: `${token}`
          }
        }
      );
      console.log(response.data,"response")
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);





// Initial state for the userProfile slice
const initialState = {
  user: null,
  status: "idle",
  favoriteProducts: [],
  currentProduct: null,
  error: null,
};

// User Profile Slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearFavoriteProducts: (state) => {
      state.favoriteProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favoriteProducts.push(action.payload.product);
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleFavoriteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(toggleFavoriteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // Assuming the response contains the updated user data
      })
      .addCase(editUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // Assuming the response contains the updated user data
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // Assuming the response contains the updated user data
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // Assuming the response contains the updated user data
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
  },
});

export default userProfileSlice.reducer;
export const { clearFavoriteProducts } = userProfileSlice.actions;
