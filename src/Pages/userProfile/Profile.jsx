import React from "react";
import "../../Styles/profile.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import Helmet from "../../Components/Helmet/Helmet";
import CommonSection from "../../Components/UI/CommonSection";
import { Container } from "reactstrap";
function Profile() {
  const location = useLocation();
  return (
    <>
      <Helmet title="profile" />
      <CommonSection title="Your Profile" />
      <Container fluid>
        <div className="profile-wrapper">
          <aside className="profile-sidebar">
            <Link
              to="basic-information"
              className={
                location.pathname.includes("basic-information") ? "active" : ""
              }
            >
              Basic Details
            </Link>
            <Link
              to="user-address"
              className={
                location.pathname.includes("user-address") ? "active" : ""
              }
            >
              Addresses
            </Link>
            <Link
              to="orders"
              className={location.pathname.includes("orders") ? "active" : ""}
            >
              Your Orders
            </Link>
          </aside>
          <div className="profile-content">
            <Outlet />
          </div>
        </div>
      </Container>
    </>
  );
}

export default Profile;
