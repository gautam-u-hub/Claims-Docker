import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { API_URL } from "../../Links";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [validated, setValidated] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      await axios.post(`${API_URL}/auth/password/forgot`, { email }, config);
      setSubmitSuccess("Please check your email for further instructions.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setSubmitSuccess(null);
    }
  };

  useEffect(() => {
    const clearMessages = setTimeout(() => {
      setSubmitSuccess(null);
      setErrorMessage(null);
    }, 15000);

    return () => clearTimeout(clearMessages);
  }, [submitSuccess, errorMessage]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          {submitSuccess && (
            <div className="alert alert-success mt-3" role="alert">
              {submitSuccess}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="card shadow">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="card-img-top"
            />
            <div className="card-body">
              <h5>Forgot Password?</h5>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        isInvalid={!!errorMessage}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
