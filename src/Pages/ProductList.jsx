import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductsBySubCategoryId } from "../Redux-ToolKit/Slices/productsSlice";
import Helmet from "../Components/Helmet/Helmet";
import CommonSection from "../Components/UI/CommonSection";
import "../Styles/productlist.css";

import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { motion } from "framer-motion";
import {
  fetchUserProfile, toggleFavoriteProduct,
} from "../Redux-ToolKit/Slices/UserProfileSlice";
import {
  addProductToCart,
  fetchCartItems,
} from "../Redux-ToolKit/Slices/CartSlice";


export default function ProductList() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { parentCategoryName, subCategoryName, subCategoryId } = useParams();
  const [localFavorites, setLocalFavorites] = useState(
    JSON.parse(localStorage.getItem("localFavorites")) || []
  );

  const dispatch = useDispatch();

  const selectedProducts = useSelector(
    (state) => state.products.selectedProducts
  );



  const [modal, setModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const navigate = useNavigate();

  const toggleModal = (product) => {
    setSelectedProductDetail(product);
    setModal(!modal);
  };

  useEffect(() => {
    dispatch(fetchProductsBySubCategoryId(subCategoryId)).then((result) => {
      if (!result.payload || result.payload.length === 0) {
        navigate("/404", { replace: true });
      }
    });
  }, [subCategoryId, dispatch, navigate]);

  const userdetails = useSelector((state) => state.userProfile.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  


  // navigate to specific product
  function handleProduct(productId, skuslug) {
    navigate(`/product/${productId}/${skuslug}`);
  }

  // add to cart
  const [productAdded, setProductAdded] = useState({});

  const [localCart, setLocalCart] = useState(
    JSON.parse(localStorage.getItem("localCart")) || []
  );

  const handleAddToCart = (productId, skuId) => {
    const selectedProduct = selectedProducts.find((p) => p._id === productId);
  
    if (!isAuthenticated) {
      let updatedLocalCart = [...localCart];
      const existingProductIndex = updatedLocalCart.findIndex(p => p._id === productId && p.skuInventory[0]._id === skuId);
  
      if (existingProductIndex !== -1) {
          updatedLocalCart[existingProductIndex].item += 1;
      } else {
          const newProduct = {
              ...selectedProduct,
              skuInventory: selectedProduct.skuInventory.filter((sku) => sku._id === skuId),
              item: 1
          };
          updatedLocalCart.push(newProduct);
      }
      
      localStorage.setItem("localCart", JSON.stringify(updatedLocalCart));
      setLocalCart(updatedLocalCart);
    } else {
      dispatch(addProductToCart({ productId, skuId }))
        .then(() => {
          setConfirmationMessage("Product successfully added to cart!");
          setConfirmationModal(true);
          dispatch(fetchCartItems());
        })
        .catch((error) => {
          console.error("There was an error:", error);
          setConfirmationMessage(
            "There was an error adding the product to cart."
          );
          setConfirmationModal(true);
        });
    }
  };
  

  // This function checks if the product with the given SKU ID is in the cart.
  const cartItems = useSelector((state) => state.cart.cartItems);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  const isProductInCart = (skuId) => {
    if (isAuthenticated) {
      return cartItems.some((item) => item.skuInventory[0]._id === skuId);
    } else {
      // Check from local storage for non-authenticated users
      const localCart = JSON.parse(localStorage.getItem("localCart")) || [];
      return localCart.some((product) => product.skuInventory[0]._id === skuId);
    }
  };

  // success modal of add to cart
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  //fav
  const handleToggleFavorite = async (productId, skuId) => {
    if (isAuthenticated) {
      // If authenticated, update the backend.
      await dispatch(toggleFavoriteProduct({ productId, skuId }));
      dispatch(fetchUserProfile()); // Refresh user profile to update favorites.
    } else {
      // For non-authenticated users, manage the favorites in local storage.
  
      // Check if the product with the specific SKU already exists in local favorites.     
      const existsInFavorites = localFavorites.some(p => p._id === productId && p.skuInventory[0]._id === skuId);

      let updatedLocalFavorites;
  
      if (existsInFavorites) {
        // If it exists, remove it from local favorites.
        updatedLocalFavorites = localFavorites.filter(p => !(p.productId === productId && p.skuId === skuId));
      } else {
        // Otherwise, add the product with the specific SKU to local favorites.
        const productToAdd = selectedProducts.find(p => p._id === productId);
        const skuToAdd = productToAdd.skuInventory.find(s => s._id === skuId);
  
        updatedLocalFavorites = [...localFavorites, {
          ...productToAdd,
          skuInventory: [skuToAdd] // Only store the selected SKU.
        }];
      }
  
      // Update local storage and the local state.
      localStorage.setItem("localFavorites", JSON.stringify(updatedLocalFavorites));
      setLocalFavorites(updatedLocalFavorites);
    }
  };
  
  
  const isProductInFavorites = (productId, skuId) => {
    if (isAuthenticated) {
      return userdetails?.favouriteProduct.some(item => item.productId === productId && item.skuId === skuId);
    } else {
      // Check from local storage for non-authenticated users
      return localFavorites.some(item => item.productId === productId && item.skuId === skuId);
    }
  };


  return (
    <>
      <Helmet title="Product" />
      <CommonSection title={`${parentCategoryName} - ${subCategoryName}`} />
      <Container fluid>
        <Row className="px-4">
          {selectedProducts?.map((product) =>
            product.skuInventory.map((sku) => (
              <Col lg="3" className="mb-2 p-3" key={sku._id}>
                <Card>
                  {/* Wrap image and overlay in a div for relative positioning */}
                  <div className="position-relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      className="img-fluid"
                      src="https://i.pinimg.com/236x/16/aa/a7/16aaa707f8fedd1beadd12fa08b5f459.jpg"
                      alt="products"
                      onClick={() => handleProduct(product._id, sku.slug)}
                    />
                    <div className="card-image-overlay">
                      <Button
                        className="view-product-button"
                        onClick={() => handleProduct(product._id, sku.slug)}
                      >
                        View Product
                      </Button>
                    </div>
                  </div>
                  <CardBody className="d-flex flex-column justify-content-between">
                    <div>
                      <CardTitle>
                        {product.productName} - ({sku.slug})
                      </CardTitle>
                      <CardSubtitle>${product.sellingPrice}</CardSubtitle>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <Button
                        className="product-button"
                        disabled={isProductInCart(sku._id)}
                        onClick={() => handleAddToCart(product._id, sku._id)}
                      >
                        {isProductInCart(sku._id)
                          ? "Already In Cart"
                          : productAdded[product._id]
                          ? "Added"
                          : "Add To Cart"}
                      </Button>
                      <i
                        className="ri-search-eye-line action-icon"
                        onClick={() => toggleModal(product)}
                      ></i>
                      <div>
                    <div>
                    {isProductInFavorites(product._id, sku._id) ? (
    <button onClick={() => handleToggleFavorite(product._id, sku._id)}>Remove from Fav</button>
) : (
    <button onClick={() => handleToggleFavorite(product._id, sku._id)}>Move to Fav</button>
)}

</div>
                        
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
        {selectedProductDetail && (
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
              {selectedProductDetail?.productName}
            </ModalHeader>
            <ModalBody className="product-modal-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="product-image">
                  <img
                    src="https://i.pinimg.com/236x/16/aa/a7/16aaa707f8fedd1beadd12fa08b5f459.jpg"
                    alt={selectedProductDetail?.productName}
                    className="img-fluid mb-3"
                  />
                  <h5 className="mb-3">{selectedProductDetail?.productName}</h5>
                  <h5>Size:</h5>
                  <p className="mb-3">24</p>
                  <h5>Color :</h5>
                  <span class="dot"></span>
                </div>
                <div className="product-details">
                  <h5 className="mb-3">Product Description:</h5>
                  <p>{selectedProductDetail?.productDescription}</p>
                  <h5 className="mb-3">Price:</h5>
                  <p>${selectedProductDetail?.sellingPrice}</p>
                  <h5 className="mb-3">Product Details:</h5>
                  {selectedProductDetail?.productDetails.map((detail) => (
                    <li key={detail._id}>
                      <strong>{detail.title}</strong>: {detail.description}
                    </li>
                  ))}
                  <Button className="mt-3 align-items-center d-flex ">
                    Add to Cart <i class="ri-shopping-cart-line"></i>
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        )}
        {/* success modal */}
        {confirmationModal && (
          <Modal
            isOpen={confirmationModal}
            toggle={() => setConfirmationModal(!confirmationModal)}
          >
            <ModalHeader
              toggle={() => setConfirmationModal(!confirmationModal)}
            >
              Confirmation
            </ModalHeader>
            <ModalBody>{confirmationMessage}</ModalBody>
          </Modal>
        )}
      </Container>
    </>
  );
}
