// CartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    // console.log(token)
    try {
      const response = await axios.get('http://localhost:8000/user/getCartProduct', {
        headers: {
          Authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Async thunk to add product to cart
export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async ({ productId, skuId }, thunkAPI) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/user/addCartProduct',
        { productId, skuId },
        { headers: { Authorization: `${token}` } }
      );

      if (response.status !== 200) {
        throw new Error("Failed to add product to cart");
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Async thunk to remove product from cart
export const removeProductFromCart = createAsyncThunk(
  'cart/removeProductFromCart',
  async ({ productId, skuId }, thunkAPI) => {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.put('http://localhost:8000/user/removeCartProduct', 
              { productId, skuId }, 
              { headers: { Authorization: `${token}` } }
          );

          if (response.status !== 200) {
              throw new Error("Failed to delete product from cart");
          }

          return response.data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.message); // Handling error more gracefully
      }
  }
);

// Async thunk to remove product from cart
export const deleteProductFromCart = createAsyncThunk(
  'cart/removeProductFromCart',
  async ({ productId, skuId }, thunkAPI) => {
      const token = localStorage.getItem('token');
      try {
          const response = await axios.put('http://localhost:8000/user/deleteCartProduct', 
              { productId, skuId }, 
              { headers: { Authorization: `${token}` } }
          );

          if (response.status !== 200) {
              throw new Error("Failed to delete product from cart");
          }

          return response.data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.message); // Handling error more gracefully
      }
  }
);



const initialState = {
  cartItems: [],
  totalAmount: 0,
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push(newItem);
      }
      state.totalAmount += newItem.price;
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        state.totalAmount -= existingItem.price;
        state.cartItems = state.cartItems.filter(item => item.id !== id);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    updateCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        if (action.payload && action.payload.products) {
          state.cartItems = action.payload.products;
          state.totalAmount = action.payload.products.reduce((acc, product) => {
            if (product.skuInventory && product.skuInventory.length > 0) {
              return acc + (product.sellingPrice * product.skuInventory[0].quantity);
            } else {
              return acc;
            }
          }, 0);
        }
        state.status = 'succeeded';
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle addProductToCart actions
      .addCase(addProductToCart.fulfilled, (state, action) => {
        if (action.payload && action.payload.skuInventory && action.payload.skuInventory.length > 0) {
          state.cartItems.push(action.payload);
          state.totalAmount += action.payload.sellingPrice * action.payload.skuInventory[0].quantity;
        }
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        const { productId, skuId } = action.meta.arg;
        state.cartItems = state.cartItems.filter(item => {
            if (item && item._id === productId && item.skuInventory && item.skuInventory.length > 0 && item.skuInventory[0]._id === skuId) {
                return false;
            }
            return true;
        });

        state.totalAmount = state.cartItems.reduce((acc, item) => {
          if (item.skuInventory && item.skuInventory.length > 0) {
            return acc + (item.sellingPrice * item.skuInventory[0].quantity);
          } else {
            return acc;
          }
        }, 0);
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      
    
      
     
  }
});

export const { addItem, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
