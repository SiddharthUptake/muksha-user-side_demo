import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchUserProfile, toggleFavoriteProduct } from "../Redux-ToolKit/Slices/UserProfileSlice";
import {
  fetchColorById,
  fetchSizeById,
} from "../Redux-ToolKit/Slices/miscellaneousSlice";
import "../Styles/productDetails.css";
import { Button, Col, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  addProductToCart,
  fetchCartItems,
} from "../Redux-ToolKit/Slices/CartSlice";

const ProductDetails = () => {
  const { productId, skuSlug } = useParams();
  const dispatch = useDispatch();

  const [selectedSku, setSelectedSku] = useState(null);

  const handleSizeClick = (sku) => {
    setSelectedSku(sku);
  };

  const product = useSelector((state) =>
    state.userProfile.favoriteProducts.find((p) => p._id === productId)
  );

  const colors = useSelector((state) => state.miscellaneous.colors);
  const sizes = useSelector((state) => state.miscellaneous.sizes);
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    if (product) {
      dispatch(fetchCartItems());
    }
  }, [productId, dispatch, product]);

  useEffect(() => {
    if (product) {
      product.skuInventory.forEach((item) => {
        dispatch(fetchColorById(item.colorId));
        dispatch(fetchSizeById(item.sizeId));
      });
      const foundSku = product.skuInventory.find(
        (item) => item.slug === skuSlug
      );
      if (foundSku) {
        setSelectedSku(foundSku);
      }
    }
  }, [product, dispatch, skuSlug]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isProductInCart = (skuId) => {
    if (isAuthenticated) {
      return cartItems.some((item) => item.skuInventory[0]._id === skuId);
    } else {
      const localCart = JSON.parse(localStorage.getItem("localCart")) || [];
      return localCart.some(
        (product) => product.skuInventory[0]._id === skuId
      );
    }
  };
  
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  
  const handleAddToCart = () => {
    if (!selectedSku) {
        setMessage("Please select a size before adding to cart.");
        toggleModal();
        return;
    }

    if (isAuthenticated) {
        dispatch(
            addProductToCart({ productId: product._id, skuId: selectedSku._id })
        ).then((response) => {
            if (response.type.endsWith("fulfilled")) {
                setMessage("Product added to cart!");
            } else {
                setMessage("Failed to add product. Please try again.");
            }
            toggleModal();
        });
    } else {
        const localCart = JSON.parse(localStorage.getItem("localCart")) || [];

        const existingProductIndex = localCart.findIndex(
            p => p._id === product._id && p.skuInventory[0]._id === selectedSku._id
        );

        if (existingProductIndex !== -1) {
            localCart[existingProductIndex].item += 1;
        } else {
            const productWithSku = {
                ...product,
                skuInventory: [selectedSku],
                item: 1
            };
            localCart.push(productWithSku);
        }

        localStorage.setItem("localCart", JSON.stringify(localCart));
        setMessage("Product added to local cart!");
        toggleModal();
    }
};

// const userFavorites = useSelector(
//   (state) => state.userProfile.user.favouriteProduct
// );

// const isProductInFavorites = (productId, skuId) => {
//   if (isAuthenticated) {
//     return userFavorites.some(
//       (item) => item.productId === productId && item.skuId === skuId
//     );
//   } else {
//     const localFavorites = JSON.parse(localStorage.getItem("localFavorites")) || [];
//     return localFavorites.some(
//       (product) => product._id === productId && product.skuInventory[0]._id === skuId
//     );
//   }
// };

// const handleToggleFavorite = async () => {
//   if (isAuthenticated) {
//     // If authenticated, update the backend.
//     await dispatch(
//       toggleFavoriteProduct({
//         productId: product._id,
//         skuId: selectedSku._id,
//       })
//     );
//     dispatch(fetchUserProfile()); // Refresh user profile to update favorites.
//   } else {
//     const localFavorites = JSON.parse(localStorage.getItem("localFavorites")) || [];
//     const existsInFavorites = localFavorites.some(
//       (product) => product._id === productId && product.skuInventory[0]._id === selectedSku._id
//     );
//     let updatedLocalFavorites;

//     if (existsInFavorites) {
//       updatedLocalFavorites = localFavorites.filter(
//         (product) => !(product._id === productId && product.skuInventory[0]._id === selectedSku._id)
//       );
//     } else {
//       updatedLocalFavorites = [...localFavorites, {
//         ...product,
//         skuInventory: [selectedSku],
//       }];
//     }

//     localStorage.setItem("localFavorites", JSON.stringify(updatedLocalFavorites));
//   }
// };



  const getColor = (colorId) => colors.find((c) => c._id === colorId);
  const getSize = (sizeId) => sizes.find((s) => s._id === sizeId);

  const groupedByColor = product?.skuInventory.reduce((acc, item) => {
    (acc[item.colorId] = acc[item.colorId] || []).push(item);
    return acc;
  }, {});

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-container">
      <Row>
        <Col lg="6">
          <div className="product-image d-flex justify-content-center align-items-center">
            <img
              src="https://i.pinimg.com/236x/16/aa/a7/16aaa707f8fedd1beadd12fa08b5f459.jpg"
              alt={product.productName}
            />
          </div>
        </Col>

        <Col lg="6">
          <div className="product-details-content">
            <h1>
              {product.productName} {selectedSku && ` - (${selectedSku.slug})`}
            </h1>
            <h2 className="price mt-4 mb-4">${product.sellingPrice}</h2>

            {groupedByColor &&
              Object.keys(groupedByColor).map((colorId) => (
                <div key={colorId} className="product-color-section mt-4 mb-4">
                  <div className="color-display">
                    <div
                      className="color-circle"
                      style={{ backgroundColor: getColor(colorId)?.colorCode }}
                    ></div>
                    <h4>{getColor(colorId)?.slug}</h4>
                  </div>

                  <div className="sizes-for-color">
                    {groupedByColor[colorId].map((sku) => (
                      <div
                        key={sku._id}
                        className={`sku-item ${
                          sku === selectedSku ? "highlighted" : ""
                        }`}
                        onClick={() => handleSizeClick(sku)}
                      >
                        <h5>Size: {getSize(sku.sizeId)?.slug}</h5>
                        <h6>Slug: {sku.slug}</h6>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {/* actions */}
            <Row>
              <Col lg="6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isProductInCart(selectedSku?._id)}
                >
                  {isProductInCart(selectedSku?._id)
                    ? "Already In Cart"
                    : "Add To Cart"}
                </Button>
              </Col>

              <Col lg="6">
              {/* <Button onClick={handleToggleFavorite}>
          {isProductInFavorites(product._id, selectedSku?._id)
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </Button> */}
              </Col>
            </Row>

            {/* end actions */}
            <div className="product-more-details-section">
              <h3>Additional Details</h3>
              <table className="product-details-table">
                <tbody>
                  {product.productDetails.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.title}</strong>
                      </td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <div className="product-description-section mt-5">
          <h3>Description</h3>
          <p>{product.productDescription}</p>
        </div>
      </Row>
      {/* modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirmation</ModalHeader>
        <ModalBody>{message}</ModalBody>
      </Modal>
    </div>
  );
};

export default ProductDetails;
