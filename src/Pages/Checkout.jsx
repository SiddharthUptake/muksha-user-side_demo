import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Input, FormGroup, Label } from "reactstrap";
import Helmet from "../Components/Helmet/Helmet";
import "../Styles/checkout.css";
import CommonSection from "../Components/UI/CommonSection";
import img from "../assets/images/heroine.png"
import { fetchCartItems } from "../Redux-ToolKit/Slices/CartSlice";
function Checkout() {
    const cartItems = useSelector(state => state.cart.cartItems);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
    const subtotal = cartItems.reduce((acc, item) => acc + item.sellingPrice * item.item, 0);
    const deliveryCharges = subtotal >= 1000 ? 0 : 50;
    const gst = (subtotal * 0.09); // Assuming 9% for GST
    const sgst = (subtotal * 0.09); // Assuming 9% for SGST

    const grandTotal = subtotal + deliveryCharges + gst + sgst - discount;
   
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchCartItems())
    })

    const applyCoupon = () => {
        // Logic to apply coupon and set discount
        // For now, let's assume a static coupon "DISCOUNT10" which gives a 10% discount
        if (coupon === "SIDD10") {
            const discountValue = (subtotal * 0.10);
            setDiscount(discountValue);
        } else {
            alert("Invalid coupon");
        }
    };

    function placeOrder(){
        console.log(grandTotal)
    }

    return (
      <>
        <Helmet title="checkout"/>
        <CommonSection title="checkout"/>
        <Container fluid className="checkout-container mb-5">
            <Helmet title="Checkout" />
            <Row className="px-4">
                <Col lg="8">
                    <div className="checkout-section">
                        <h4>Order Summary</h4>
                        {cartItems.map((item, index) => (
                            <div key={index} className="checkout-item">
                                <img src={img} alt={item.productName} width="50" height="50" />
                                <span>{item.productName}</span>
                                <span>${item.sellingPrice.toFixed(2)}</span>
                                <span>x {item.item}</span>
                                <span>${(item.sellingPrice * item.item).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-section">
                        <h4>Payment Method</h4>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="paymentMethod" value="cod" checked={selectedPaymentMethod === 'cod'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />
                                Cash on Delivery
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />
                                Credit/Debit Card
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="paymentMethod" value="upi" checked={selectedPaymentMethod === 'upi'} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />
                                UPI
                            </Label>
                        </FormGroup>
                    </div>
                </Col>

                <Col lg="4">
                    <div className="checkout-section">
                        <h4>Price Details</h4>
                        <div className="price-detail">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="price-detail">
                            <span>GST (9%):</span>
                            <span>${gst.toFixed(2)}</span>
                        </div>
                        <div className="price-detail">
                            <span>SGST (9%):</span>
                            <span>${sgst.toFixed(2)}</span>
                        </div>
                        <div className="price-detail">
                            <span>Delivery Charges:</span>
                            <span>${deliveryCharges.toFixed(2)}</span>
                        </div>
                        <div className="price-detail">
                            <span>Discount:</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="price-detail total">
                            <span>Total:</span>
                            <span>${grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="coupon-section">
                            <Input type="text" placeholder="Enter coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                            <Button color="primary" onClick={applyCoupon}>Apply</Button>
                        </div>
                        <Button color="success" className="mt-5" size="lg" block onClick={placeOrder}>Place Order</Button>
                    </div>
                </Col>
            </Row>
        </Container>
      </>
    );
}

export default Checkout;
