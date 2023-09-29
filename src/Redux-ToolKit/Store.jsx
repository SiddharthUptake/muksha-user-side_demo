import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./Slices/CartSlice";
import productsReducer from "./Slices/productsSlice";
import authReducer from "./Slices/authSlice";
import categoryReducer from "./Slices/categorySlice";
import collectionReducer from "./Slices/collectionSlice";
import UserProfileReducer from "./Slices/UserProfileSlice";
import miscellaneousReducer from "./Slices/miscellaneousSlice";

const store = configureStore({
    reducer: {
        cart: CartReducer,
        products: productsReducer,
        auth: authReducer,
        categories : categoryReducer,
        collections: collectionReducer,
        userProfile : UserProfileReducer,
        miscellaneous : miscellaneousReducer,
    }   
})

export default store;