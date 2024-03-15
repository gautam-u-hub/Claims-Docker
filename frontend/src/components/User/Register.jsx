import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../../store/userAction";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const { user } = useSelector((state) => state.user.user) || {};
  const { error } = useSelector((state) => state.error);

  useEffect(() => {
    if (error) {
      alert(error);
      setBackendError(error);
      dispatch(clearErrors());
      setTimeout(() => {}, 5000);
    } else {
    }
    if (user && user.name.length > 0) {
      setSuccessMessage("Registration successful. Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [dispatch, error, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    }

    if (!name.trim()) {
      setNameError("Please enter your name.");
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneNumberError("Please enter a valid phone number.");
    }

    if (
      isValidEmail(email) &&
      password.length >= 8 &&
      name.trim() &&
      isValidPhoneNumber(phoneNumber)
    ) {
      try {
        await dispatch(registerUser({ name, email, phoneNumber, password }));
      } catch (e) {
        console.error("Registration failed: ", e);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(null);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
    setPhoneNumberError(null);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(null);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setNameError(null);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <Card className="shadow">
            <Card.Img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="card-img-top"
            />
          </Card>
          <br />
          {backendError && (
            <div className="alert alert-danger" role="alert">
              {backendError}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <br />
          <h5 className="card-title">Register</h5>
          <br />

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                <Form.Label>Name</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    required
                    value={name}
                    onChange={handleNameChange}
                    isInvalid={!!nameError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {nameError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>+91</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                  isInvalid={!!phoneNumberError}
                />
                <Form.Control.Feedback type="invalid">
                  {phoneNumberError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustomPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Button type="submit">Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
