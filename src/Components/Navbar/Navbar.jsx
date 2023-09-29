import React, { useRef, useEffect, useState } from "react";
import logo from "../../assets/images/eco-logo.png";
import "./Navbar.css";
import {
  Button,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Row,
} from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux-ToolKit/Slices/authSlice";
import { fetchAllCategories } from "../../Redux-ToolKit/Slices/categorySlice";
import {
  fetchProductsByCollectionId,
  fetchProductsBySubCategoryId,
} from "../../Redux-ToolKit/Slices/productsSlice";
import { fetchAllCollections } from "../../Redux-ToolKit/Slices/collectionSlice";

function Header({ direction, ...args }) {
  // auth or not
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // console.log(isAuthenticated)

  // cart length && fav length
  const cartLength = useSelector((state) => state.cart.cartItems.length);
   const [displayCartLength, setDisplayCartLength] = useState(0);
   const localCart = JSON.parse(localStorage.getItem("localCart")) || [];

   useEffect(() => {
     if (isAuthenticated) {
       setDisplayCartLength(cartLength);
     } else {
       setDisplayCartLength(localCart.length);
     }
   }, [isAuthenticated, cartLength, localCart]);
 



  // user firstname and lastname
  const user = useSelector((state) => state.auth.user);
  // console.log(user);

  // logout
  const dispatch = useDispatch();

  // fetch all categories
  const categories = useSelector((state) => state.categories);
  // console.log(categories, "catt"); // 

  // fetch collection
  const collections = useSelector((state) => state.collections);
  const filteredCollection = collections.filter(
    (collection) => collection.status === true
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllCollections()); // Fetching collections here
  }, [dispatch]);

  // fetching by id
  const handleSubCategoryClick = (
    parentCategoryName,
    subCategoryName,
    subCategoryId
  ) => {
    dispatch(fetchProductsBySubCategoryId(subCategoryId));

    // Update the URL
    navigate(
      `/ProductList/${parentCategoryName}/${subCategoryName}/${subCategoryId}`
    );
  };

  const handleCollectionClick = (collectionId, collectionName) => {
    dispatch(fetchProductsByCollectionId(collectionId));
    navigate(`/productsByCollection/${collectionName}/${collectionId}`);
  };

  const handleLogout = () => {
    // navigate("/"); // Redirecting the user to the login page after logging out. // not working
    dispatch(logout());
    window.location.reload()
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const navigate = useNavigate();

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function navigateToFav() {
    navigate("/favourites");
    window.scrollTo(0, 0);
  }

 
  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  function NavigateHome() {
    navigate("/");
  }
  return (
    <>
      <header className="header" ref={headerRef}>
        <Container fluid>
          <Row>
            <div className="nav__wrapper px-4">
              <div className="logo" onClick={NavigateHome}>
                <img src={logo} alt="logo" />
                <div className="mt-2">
                  <h1>Muksha</h1>
                </div>
              </div>
              <div className="navigation" ref={menuRef} onClick={menuToggle}>
                <ul className="menu">
                  <li className="nav__item">
                    <NavLink
                      to="/home"
                      className={(e) => (e.isActive ? "nav__active" : "")}
                    >
                      Home
                    </NavLink>
                  </li>
                  {categories.map((category) => (
                    <UncontrolledDropdown nav inNavbar key={category._id}>
                      <DropdownToggle nav caret>
                        {category.categoryName}
                      </DropdownToggle>
                      <DropdownMenu right>
                        {category.subCategories.map((subCategory) => (
                          <DropdownItem
                          className="header-links"
                            key={subCategory._id}
                            onClick={() =>
                              handleSubCategoryClick(
                                category.categoryName,
                                subCategory.categoryName,
                                subCategory._id
                              )
                            }
                          >
                            {subCategory.categoryName}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ))}
                  {/* collections */}
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Collections
                    </DropdownToggle>
                    <DropdownMenu right>
                      {filteredCollection.map((collection) => (
                        <DropdownItem
                         className="header-links"
                          key={collection._id}
                          onClick={() =>
                            handleCollectionClick(
                              collection._id,
                              collection.collectionName
                            )
                          }
                        >
                          {collection.collectionName}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ul>
              </div>
              <div className="nav__icons">
                <span className="fav__icon" onClick={navigateToFav}>
                  <i class="ri-heart-line"></i>
                  <span className="badges">{`0`}</span>
                </span>
                <span className="cart__icon" onClick={() => navigate("/cart")}>
                  <i class="ri-shopping-bag-line"></i>
                  <span className="badges">{displayCartLength}</span>
                </span>
                <div>
                  {isAuthenticated ? (
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggle}
                      direction={direction}
                    >
                      <DropdownToggle caret>
                        hello {user.firstName}
                      </DropdownToggle>
                      <DropdownMenu {...args} className="mt-2">
                        <DropdownItem
                         className="header-links"
                          header
                          onClick={() => navigate("/profile/basic-information")}
                        >
                          <i class="ri-user-line"></i>
                          <NavLink to="/profile/basic-information"> Profile</NavLink>
                        </DropdownItem>
                        <DropdownItem
                         className="header-links"
                          header
                        >
                          <i class="ri-logout-box-line"></i>
                          <NavLink onClick={handleLogout}> Logout</NavLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggle}
                      direction={direction}
                    >
                      <DropdownToggle caret>Account</DropdownToggle>
                      <DropdownMenu {...args} className="mt-2">
                        <DropdownItem header>
                          <i class="ri-login-box-line"></i>{" "}
                          <NavLink to="/login">Login</NavLink>
                        </DropdownItem>
                        <DropdownItem
                          header
                          onClick={() => navigate("/signup")}
                        >
                          <i class="ri-pencil-line"></i>{" "}
                          <NavLink to="/signup">Sign up</NavLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>

                <div className="mobile__menu">
                  <span onClick={menuToggle}>
                    <i class="ri-menu-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </header>
    </>
  );
}

export default Header;
