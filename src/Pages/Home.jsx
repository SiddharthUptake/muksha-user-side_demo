import React, { useEffect, useState } from "react";
import Helmet from "../Components/Helmet/Helmet";
import { Col, Container, Row } from "reactstrap";
import heroimg from "../assets/images/heroine.png";
import "../Styles/home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Services from "../Services/Services";
import counterImg from "../assets/images/counter-timer-img.png";
import Clock from "../Components/UI/Clock";
import fashion from "../assets/images/fashion5.mp4";
import { useDispatch } from "react-redux";
function Home() {
  const year = new Date().getFullYear();
  
  return (
    <>
      <Helmet title={"Home"}>
        <section className="hero__section">
          <div className="hero__video-container">
            <video className="hero__video" autoPlay muted loop>
              <source src={fashion} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <Container fluid className="hero__overlay">
            <Row lg="12" className="px-4">
              <Col lg="12">
                <div className="hero-layer">
                  <div className="hero__content">
                    <h6 className="hero__subtitle">
                      Trending Products in {year}
                    </h6>
                    <h2>Make Your Outfit More Minimalistic & Modern</h2>
                    <h6>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Deleniti accusamus rem possimus voluptatem ea adipisci
                      cupiditate incidunt,
                      <br /> eum voluptates explicabo libero, labore ipsum,
                      natus beatae consectetur veniam ducimus quo deserunt.
                    </h6>
                  </div>
                </div>
              </Col>
              {/* <Col lg="6" md="6">
        <div className="hero__img">
          <img src={heroimg} alt="heroimg" />
        </div>
      </Col> */}
            </Row>
          </Container>
        </section>

        <Services />
        <section className="trending__products">
          <Container fluid>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title">Trending Products</h2>
              </Col>
              {/* <ProductList  data={trendingProducts}/> */}
            </Row>
          </Container>
        </section>
        <section className="best__sales">
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title">Best Sales</h2>
              </Col>
              {/* <ProductList  data={bestSalesProducts}/> */}
            </Row>
          </Container>
        </section>

        <section className="3">
          <Container fluid>
            <Row className="px-5">
              <Col lg="6">
                <div className="clock_top-content">
                  <h4 className="text-white fs-6 mb-2">Limited Offers</h4>
                  <h3 className="text-white fs-5 mb-3">Quality ArmChair</h3>
                </div>
                <Clock />
                
              </Col>
              <Col lg="6"  className="text-end">
                <img src={counterImg} alt="counter" />
              </Col>
            </Row>
          </Container>
        </section>

        <section className="new_arrivals">
          <Container>
            <Row>
              <Col lg="12" className="text-center mb-3">
                <h2 className="section__title">New Arrivals</h2>
              </Col>
              {/* <ProductList data={mobileProducts} />
            <ProductList data={wirelessProducts} /> */}
            </Row>
          </Container>
        </section>

        <section className="popular__category">
          <Container>
            <Row>
              <Col lg="12" className="text-center mb-5">
                <h2 className="section__title">Popular in Category</h2>
              </Col>
              {/* <ProductList data={popularProducts} /> */}
            </Row>
          </Container>
        </section>
      </Helmet>
    </>
  );
}

export default Home;
