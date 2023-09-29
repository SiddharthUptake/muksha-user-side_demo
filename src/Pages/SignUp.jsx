import React, { useState } from "react";
import Helmet from "../Components/Helmet/Helmet";
import { Col, Container, Form, FormGroup, Row , Modal , ModalBody, ModalHeader} from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../Redux-ToolKit/Slices/authSlice';  
import "../Styles/login.css";

function SignUp() {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isVerified = useSelector((state) => state.auth.isVerified);  // You should have a boolean flag in your Redux store indicating if email is verified

  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // This was already defined

  const [passwordError, setPasswordError] = useState('');  // To store the password error message

  const initialFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password' || name === 'confirmPassword') {
      const updatedFormData = { ...formData, [name]: value };

      if (updatedFormData.password !== updatedFormData.confirmPassword) {
        setPasswordError("Passwords don't match!");
      } else {
        setPasswordError(''); // Clear the error message if passwords match
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      const actionResult =  await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(actionResult)) {
        if (isVerified) {
          setSuccessMessage("Sign up and verification successful!");
        } else {
          setSuccessMessage("Sign up successful! Please verify your email.");
        }
        setFormData(initialFormData);
        setShowModal(true);
      } else {
        // console.log(actionResult)
        setSuccessMessage("Some Error Occurred");
        setShowModal(true);
      }
    } else {
      setSuccessMessage("Passwords don't match!");
      setShowModal(true);
    }
  };

  let modalMessage = authError || successMessage;  // Display error message if it exists, otherwise display success message

  return (
    <>
      <Helmet title="Sign Up">
        <Container>
          <Row>
              <Col lg="6" className="m-auto text-center mt-5">
                <h3 className="fw-bold fs-4">Sign Up</h3>
                <Form className="auth__form mb-5" onSubmit={handleSubmit}>
                  <FormGroup className="form__group d-flex">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter Your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter Your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <select
                      name="gender"
                      className="form-select"
                      aria-label="Default select example"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormGroup>

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
                      value={formData.password}
                      placeholder="Enter Your Password"
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      placeholder="Enter Confirm Password"
                      onChange={handleInputChange}
                      required
                      />
                      {passwordError && <span className="error-message mt-3">{passwordError}</span>}
                  </FormGroup>

                  <button type="submit" className="buy__btn auth__btn">
                    Sign up
                  </button>
                  {authError && <div className="error-message">{authError.message}</div>}
                  <p className="mt-3 text-white">
                    Already have an account?
                    <Link to="/login" className="account">
                      Login
                    </Link>
                  </p>
                </Form>
              </Col>
          </Row>
        </Container>
        {/* modal */}
        <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalHeader toggle={() => {
          setShowModal(!showModal)}}>Sign Up Status</ModalHeader>
        <ModalBody>
          {modalMessage}
        </ModalBody>
      </Modal>
      </Helmet>
    </>
  );
}

export default SignUp;
