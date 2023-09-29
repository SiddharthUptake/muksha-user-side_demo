import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchProductById,
  removeFavoriteProduct,
  toggleFavoriteProduct,
} from "../Redux-ToolKit/Slices/UserProfileSlice";
import Helmet from "../Components/Helmet/Helmet";
import CommonSection from "../Components/UI/CommonSection";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Fav = () => {
  // Using React's useState and useEffect hooks for local component state and side-effects.
  const dispatch = useDispatch(); // Hook from `react-redux` to dispatch actions.
  const [modal, setModal] = useState(false); // State to manage modal visibility.
  const [selectedProduct, setSelectedProduct] = useState(null); // State to manage the currently selected product.

  // Getting user details and authentication state from Redux store.
  const userdetails = useSelector((state) => state.userProfile.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const localFavorites =
    JSON.parse(localStorage.getItem("localFavorites")) || []; // Getting local favorites from local storage.
  const [favProducts, setFavProducts] = useState(localFavorites); // Local state initialized with local favorites.

  // Fetching user profile when the component mounts if the user is authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  console.log(userdetails, "userdetails");
  console.log(favProducts, "fav");

  // Fetching favorite products details from the backend if the user is authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      const fetchFavProducts = async () => {
        let products = [];
        if (userdetails?.favouriteProduct) {
          for (const fav of userdetails.favouriteProduct) {
            const response = await dispatch(fetchProductById(fav.productId));
            if (response.payload.product) {
              const relevantSku = response.payload.product.skuInventory.find(
                (sku) => sku._id === fav.skuId
              );
              const productWithRelevantSku = {
                ...response.payload.product,
                skuInventory: [relevantSku],
              };
              products.push(productWithRelevantSku);
            }
          }
        }
        setFavProducts(products);
      };
      fetchFavProducts();
    } else {
      setFavProducts(localFavorites);
    }
  }, [dispatch, userdetails, isAuthenticated]);

  // Handler for clicking on the eye icon to view product details.
  const handleEyeClick = (product) => {
    setSelectedProduct(product);
    setModal(true); // Show modal.
  };

  const navigate = useNavigate();
  const handleProductView = (productId, skuSlug) => {
    navigate(`/product/${productId}/${skuSlug}`);
  };

  const handleRemoveFromFav = async (productId, skuId) => {
    console.log(productId, skuId, " fav");
    if (isAuthenticated) {
      await dispatch(toggleFavoriteProduct({ productId, skuId }));
      dispatch(fetchUserProfile());
    } else {
      // For non-authenticated users, remove from local storage
      const updatedLocalFavorites = localFavorites.filter(
        (product) => !(product._id === productId && product.skuInventory[0]._id === skuId)
      );
      localStorage.setItem(
        "localFavorites",
        JSON.stringify(updatedLocalFavorites)
      );
      setFavProducts(updatedLocalFavorites);
    }
  };
  return (
    <>
      <Helmet title="Favourites" />
      <CommonSection title="Favourites" />
      <Container>
        <Row>
          {/* Mapping over favorite products to render each product card. */}
          {favProducts.map((product) => (
            <Col lg="3" className="mb-2 p-3" key={product.skuInventory[0]._id}>
              <Card>
                <div className="position-relative">
                  <motion.img
                    whileHover={{ scale: 0.9 }}
                    src="https://i.pinimg.com/236x/16/aa/a7/16aaa707f8fedd1beadd12fa08b5f459.jpg"
                    alt="product"
                  />
                  {/* Overlay for the View Product Button */}
                  <div className="card-image-overlay">
                    <Button
                      className="view-product-button"
                      onClick={() =>
                        handleProductView(
                          product._id,
                          product.skuInventory[0].slug
                        )
                      }
                    >
                      View Product
                    </Button>
                    <Button
                      color="danger"
                      onClick={() =>
                        handleRemoveFromFav(
                          product._id,
                          product.skuInventory[0]._id
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <CardBody>
                  <CardTitle>
                    {product.productName} {`(${product.skuInventory[0].slug})`}
                  </CardTitle>
                  <CardSubtitle>${product.sellingPrice}</CardSubtitle>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button onClick={() => handleEyeClick(product)}>
                      View
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal to display selected product details. */}
      {selectedProduct && (
        <Modal
          isOpen={modal}
          toggle={() => setModal(!modal)}
          centered
          className="product-modal"
        >
          <ModalHeader
            toggle={() => setModal(!modal)}
            className="product-modal-header"
          >
            {selectedProduct?.productName}{" "}
            {`(${selectedProduct.skuInventory[0].slug})`}
          </ModalHeader>
          <ModalBody className="product-modal-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="product-image">
                <img
                  src="https://i.pinimg.com/236x/16/aa/a7/16aaa707f8fedd1beadd12fa08b5f459.jpg"
                  alt={selectedProduct?.productName}
                  className="img-fluid mb-3"
                />
              </div>
              <div className="product-details">
                <h5 className="mb-3">Product Description:</h5>
                <p>{selectedProduct?.productDescription}</p>
                <h5 className="mb-3">Price:</h5>
                <p>${selectedProduct?.sellingPrice}</p>
                <h5 className="mb-3">Product Details:</h5>
                {selectedProduct?.productDetails.map((detail) => (
                  <li key={detail._id}>
                    <strong>{detail.title}</strong>: {detail.description}
                  </li>
                ))}
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default Fav;
