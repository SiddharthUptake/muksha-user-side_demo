import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Helmet from "../Components/Helmet/Helmet";
import CommonSection from "../Components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import emptyCart from "../assets/images/empty_cart.png";
import {
  addProductToCart,
  deleteProductFromCart,
  fetchCartItems,
  removeProductFromCart,
} from "../Redux-ToolKit/Slices/CartSlice";
import "../Styles/cart.css";

function Cart() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const cartItemsFromAPI = useSelector((state) => state.cart.cartItems);
  console.log(cartItemsFromAPI, "cart");

  // Retrieve local cart items when user is not authenticated
  const localCartItems = !isAuthenticated
    ? JSON.parse(localStorage.getItem("localCart")) || []
    : [];

  // Merge API cart items and local cart items
  const cartItems = [...cartItemsFromAPI, ...localCartItems];

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  const subtotal = cartItems.reduce((acc, item) => {
    const key = `${item._id}-${item.skuInventory[0]._id}`;
    const qty = quantities[key] || item.item;
    return acc + item.sellingPrice * qty;
  }, 0);

  const handleDeleteProductFromCart = async (productId, skuId) => {
    try {
      // If user is not authenticated, delete from localStorage
      if (!isAuthenticated) {
        const updatedLocalCart = localCartItems.filter(
          (item) =>
            !(item._id === productId && item.skuInventory[0]._id === skuId)
        );
        localStorage.setItem("localCart", JSON.stringify(updatedLocalCart));
        return;
      }

      // Otherwise, delete from the server
      await dispatch(deleteProductFromCart({ productId, skuId }));
      dispatch(fetchCartItems());
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  console.log(cartItems, "lol");
  return (
    <>
      <Helmet title="Cart" />
      <CommonSection title="Shopping Cart" />
      <Container fluid>
        {cartItems.length === 0 ? (
          <center>
            <img src={emptyCart} alt="emptyCart" id="emptycart" />
          </center>
        ) : (
          <Row className="px-4">
            <Col lg="9">
              <table className="table bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <Tr
                      key={`${item._id}-${index}`}
                      index={index + 1}
                      item={item}
                      onDelete={() =>
                        handleDeleteProductFromCart(
                          item._id,
                          item.skuInventory[0]._id
                        )
                      }
                      quantities={quantities}
                      setQuantities={setQuantities}
                    />
                  ))}
                </tbody>
              </table>
            </Col>
            {/* ... Rest of the Cart UI ... */}
            <Col lg="3">
              <div className="d-flex flex-column">
                <div className="subtotal__section">
                  <span className="subtotal__title">SubTotal :</span>
                  <span className="totalamt">${subtotal.toFixed(2)}</span>
                </div>
                <p className="mt-3 text-success">
                  {subtotal.toFixed(2) >= 1000
                    ? " Wow!! Your Order is eligible for free delivery"
                    : "Free Shipping on orders over $1000"}
                </p>
                <p className="text-primary">
                  Taxes and Shipping will be calculated in checkout
                </p>
                <button className="buy__btn mt-2 mb-3">
                  <Link
                    to={{
                      pathname: "/checkout",
                      state: { quantities },
                    }}
                  >
                    Check out
                  </Link>
                </button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

const Tr = memo(({ item, index, onDelete, quantities, setQuantities }) => {
  // Calculate unique key for each cart item based on product and SKU IDs
  const key = `${item._id}-${item.skuInventory[0]._id}`;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [counter, setcounter] = useState(1);

  // Retrieve the quantity of the current item from state, default to 1 if not set
  // useEffect(() => {
  //   console.log(item.item, 'outside if');

  //   if(item.item){
  //     console.log(item.item, 'inside if');
  //     return setQuantity(item.item);
  //   }
  // }, []);

  const [quantity, setQuantity] = useState(item.item);

  // Calculate the total cost for this cart item (price multiplied by quantity)
  const itemTotal = item.sellingPrice * quantity;
  const handleLocalStorageIncrement = () => {
    const cartItems = JSON.parse(localStorage.getItem("localCart")) || [];
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem._id === item._id &&
        cartItem.skuInventory[0]._id === item.skuInventory[0]._id
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].item += 1;
    } else {
      cartItems.push({ ...item, item: 1 });
    }

    localStorage.setItem("localCart", JSON.stringify(cartItems));
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  console.log(quantity, "quantity");

  const handleLocalStorageDecrement = () => {
    const cartItems = JSON.parse(localStorage.getItem("localCart")) || [];
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem._id === item._id &&
        cartItem.skuInventory[0]._id === item.skuInventory[0]._id
    );

    if (existingItemIndex > -1) {
      if (cartItems[existingItemIndex].item > 1) {
        cartItems[existingItemIndex].item -= 1;
      } else {
        cartItems.splice(existingItemIndex, 1);
      }
    }

    localStorage.setItem("localCart", JSON.stringify(cartItems));
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 0));
  };

  const increment = async () => {
    try {
      const actionResult = await dispatch(
        addProductToCart({
          productId: item._id,
          skuId: item.skuInventory[0]._id,
        })
      );

      if (actionResult.type.includes("fulfilled")) {
        setQuantity(prevQuantity => prevQuantity + 1);
        await dispatch(fetchCartItems()); // Re-fetch cart items after successfully adding a product
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const decrement = async () => {
    try {
      const actionResult = await dispatch(
        removeProductFromCart({
          productId: item._id,
          skuId: item.skuInventory[0]._id,
        })
      );

      if (actionResult.type.includes("fulfilled")) {
        setQuantity(prevQuantity => prevQuantity - 1);
        await dispatch(fetchCartItems()); // Re-fetch cart items after successfully removing a product
      }
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  return (
    <tr>
      <td>{index}</td>
      <td>
        <img
          src={emptyCart}
          alt="productImg"
          style={{ width: "50px", height: "50px" }}
        />
      </td>
      <td>
        {item.productName} ({item.skuInventory[0].slug})
      </td>
      <td>${item.sellingPrice.toFixed(2)}</td>
      <td>
        <div className="counterWrapper">
          <button
            onClick={isAuthenticated ? decrement : handleLocalStorageDecrement}
            className="counterButton"
          >
            -
          </button>
          <div className="counterValue">{quantity}</div>
          <button
            onClick={isAuthenticated ? increment : handleLocalStorageIncrement}
            className="counterButton"
          >
            +
          </button>
        </div>
      </td>
      <td>${itemTotal.toFixed(2)}</td>
      <td>
        <i className="ri-delete-bin-5-line" onClick={onDelete}></i>
      </td>
    </tr>
  );
});

export default Cart;
