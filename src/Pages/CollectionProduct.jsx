import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Helmet from "../Components/Helmet/Helmet";
import CommonSection from "../Components/UI/CommonSection";
import { fetchProductsByCollectionId } from "../Redux-ToolKit/Slices/productsSlice";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { motion } from "framer-motion";
import {
  fetchUserProfile,
  toggleFavoriteProduct,
} from "../Redux-ToolKit/Slices/UserProfileSlice";

function CollectionProduct() {
  const dispatch = useDispatch();
  const { collectionId, collectionName } = useParams();

  const products = useSelector((state) => state.products.productsByCollection);
  // Filter products to only show those with status = true
  const filteredProducts = products.filter(
    (product) => product.status === true
  );
  console.log(products, "products");

  useEffect(() => {
    dispatch(fetchProductsByCollectionId(collectionId));
  }, [dispatch, collectionId]);

  const [modal, setModal] = useState(false);
  const [selectedProduct, setselectedProduct] = useState();
  function toggleModal(product) {
    setselectedProduct(product);
    setModal(true);
  }

  // add to fav
  const [localFavorites, setLocalFavorites] = useState(
    JSON.parse(localStorage.getItem("localFavorites")) || []
  );
  const userdetails = useSelector((state) => state.userProfile.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleFavoriteToggle = async (product) => {
    if (!isAuthenticated) {
      let currentFavorites = [...localFavorites];
      const existingProduct = currentFavorites.find(
        (p) => p._id === product._id
      );
      if (existingProduct) {
        currentFavorites = currentFavorites.filter(
          (p) => p._id !== product._id
        );
      } else {
        currentFavorites.push(product); // store entire product
      }
      setLocalFavorites(currentFavorites); // This will force a re-render
      localStorage.setItem("localFavorites", JSON.stringify(currentFavorites));
    } else {
      await dispatch(toggleFavoriteProduct(product._id));
      dispatch(fetchUserProfile());
    }
  };

  const isProductFavorited = (productId) => {
    if (isAuthenticated && userdetails && userdetails.favourites) {
      return userdetails.favourites.some((fav) => fav.productID === productId);
    } else {
      const localFavorites =
        JSON.parse(localStorage.getItem("localFavorites")) || [];
      return localFavorites.some((product) => product._id === productId);
    }
  };
  return (
    <>
      <Helmet title="Collection Products" />
      <CommonSection title={`${collectionName} Collection`} />

      <Container>
        <Row>
          {filteredProducts?.map((product) => (
            <Col lg="3" className="mb-2 p-3" key={product._id}>
              <Card>
                <motion.img
                  whileHover={{ scale: 0.9 }}
                  src="https://aesthetic-clothing.com/cdn/shop/products/aesthetic-clothing-womens-rainbow-striped-shirt-770_2048x2048.jpg?v=1635413845"
                  alt="products"
                />
                <CardBody>
                  <CardTitle>{product.productName}</CardTitle>
                  <CardSubtitle>${product.sellingPrice}</CardSubtitle>
                  <CardText></CardText>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex" style={{ gap: "12px" }}>
                      <Button>Add To Cart</Button>
                      <i
                        className="ri-search-eye-line"
                        style={{ fontSize: "30px" }}
                        onClick={() => toggleModal(product)}
                      ></i>
                      <div className="d-flex" style={{ gap: "12px" }}>
                        <Button onClick={() => handleFavoriteToggle(product)}>
                          {isProductFavorited(product._id)
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal */}
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
              {selectedProduct?.productName}
            </ModalHeader>
            <ModalBody className="product-modal-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="product-image">
                  <img
                    src="https://aesthetic-clothing.com/cdn/shop/products/aesthetic-clothing-womens-rainbow-striped-shirt-770_2048x2048.jpg?v=1635413845"
                    alt={selectedProduct?.productName}
                    className="img-fluid mb-3"
                  />
                  <h5 className="mb-3">{selectedProduct?.productName}</h5>
                  <h5>Size:</h5>
                  <p className="mb-3">24</p>
                  <h5>Color :</h5>
                  <span class="dot"></span>
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
                  <Button className="mt-3 align-items-center d-flex ">
                    Add to Cart <i class="ri-shopping-cart-line"></i>
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        )}
      </Container>
    </>
  );
}

export default CollectionProduct;
