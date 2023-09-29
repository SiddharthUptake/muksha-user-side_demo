// Routers.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Cart from "../Pages/Cart";
import SignUp from "../Pages/SignUp";
import Login from "../Pages/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import GuestRoute from "./GuestRoute"; // Import the GuestRoute
import Fav from "../Favourites/Fav";
import Checkout from "../Pages/Checkout";
import ProductList from "../Pages/ProductList";
import NotFound from "../Pages/NotFound";
import CollectionProduct from "../Pages/CollectionProduct";
import ProductDetails from "../Pages/ProductDetails";
import Profile from "../Pages/userProfile/Profile";
import PersonalInfo from "../Pages/userProfile/BasicDetails";
import UserOrders from "../Pages/userProfile/UserOrders";
import BasicDetails from "../Pages/userProfile/BasicDetails";
import Addresses from "../Pages/userProfile/Addresses";
function Routers() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="home" />} />
        <Route exact path="/home" element={<Home />} />
        {/* <Route exact path="/shop/:id" element={<ProductDetails />} /> */}
        <Route
          path="/ProductList/:parentCategoryName/:subCategoryName/:subCategoryId"
          element={<ProductList />}
        />
        <Route
          path="/productsByCollection/:collectionName/:collectionId"
          element={<CollectionProduct />}
        />
        <Route
          path="/product/:productId/:skuSlug"
          element={<ProductDetails />}
        />

        <Route exact path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        >
          <Route index element={<PersonalInfo />} />
          <Route path="basic-information" element={<BasicDetails />} />
          <Route path="user-address" element={<Addresses />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>
        <Route
          exact
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />
        <Route exact path="/favourites" element={<Fav />} />

        {/* Adjusted usage for GuestRoute and ProtectedRoute */}
        <Route
          exact
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          exact
          path="/signup"
          element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Routers;
