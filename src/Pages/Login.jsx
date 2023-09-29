// First, we import all the necessary packages and components:
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // This is a hook for programmatic navigation
import { loginUser } from "../Redux-ToolKit/Slices/authSlice"; // The Redux slice action to login a user
import axios from "axios"; // We use axios to set up default headers after login
import "../Styles/login.css";
import { Form, FormGroup } from "reactstrap"; // UI components from reactstrap
import { addProductToCart } from "../Redux-ToolKit/Slices/CartSlice"; // The Redux slice action to add products to cart
import { fetchUserProfile, toggleFavoriteProduct } from "../Redux-ToolKit/Slices/UserProfileSlice";

function Login() {
  // Here, we initialize hooks and state:

  const dispatch = useDispatch(); // This is a Redux hook to dispatch actions
  const navigate = useNavigate(); // This hook allows for programmatic navigation
  const authError = useSelector((state) => state.auth.error); // A selector to get any authentication errors from the Redux state

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); // Local state for form data

  // handleInputChange is an event handler to update our local state with form values:
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // transferLocalCartToUserCart handles the movement of cart items from local storage to user's cart upon login:
  const cartItemsFromAPI = useSelector((state) => state.cart.cartItems);
  const transferLocalCartToUserCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("localCart")) || [];
  
    for (const localProduct of localCart) {
      const productId = localProduct._id;
      const skuId = localProduct.skuInventory[0]._id;
      
      // Check if this product/sku combination already exists in the user's cart
      const existingCartItem = cartItemsFromAPI.find(
        (item) => item._id === productId && item.skuInventory[0]._id === skuId
      );
  
      if (existingCartItem) {
        const totalQuantity = existingCartItem.item + localProduct.item;
        for (let i = 0; i < totalQuantity - existingCartItem.item; i++) {
          await dispatch(addProductToCart({ productId, skuId }));
        }
      } else {
        for (let i = 0; i < localProduct.item; i++) {
          await dispatch(addProductToCart({ productId, skuId }));
        }
      }
    }
    localStorage.removeItem("localCart");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const actionResult = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(actionResult)) {
      const user = await dispatch(fetchUserProfile());

      console.log(user.payload.user.favouriteProduct);

      let favouriteProducts = user.payload.user.favouriteProduct;

      console.log(favouriteProducts);

      const localFavs = JSON.parse(localStorage.getItem("localFavorites")) || [];
      for (const product of localFavs) {
        const existsInFavs = favouriteProducts.some(
          fav => fav.productId === product._id && fav.skuId === product.skuInventory[0]._id
        );

        if (!existsInFavs) {
          await dispatch(
            toggleFavoriteProduct({
              productId: product._id,
              skuId: product.skuInventory[0]._id,
            })
          );
        }
      }
      localStorage.removeItem("localFavorites");
      transferLocalCartToUserCart();
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
      navigate("/");
    }
  };

  // Finally, we return the JSX for our component:
  return (
    <Form className="auth__form mb-5" onSubmit={handleSubmit}>
      <FormGroup className="form__group">
        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup className="form__group">
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <button type="submit" className="buy__btn auth__btn">
        Login
      </button>
      {authError && <div>{authError}</div>}{" "}
      {/* Display any authentication error messages */}
    </Form>
  );
}

export default Login;
