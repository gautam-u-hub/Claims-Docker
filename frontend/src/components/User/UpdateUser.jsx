import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../store/userAction";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../Links";
import axios from "axios";

const UpdateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const error = useSelector((state) => state.error);
  const {user} = useSelector((state) => state.user.user);

  useEffect(() => {
    if (error && error.error) {
      setErrorMessage(error.error);
      dispatch(clearErrors());
      setTimeout(() => {
        setErrorMessage(null);
        setValidated(false); // Clear validation state
      }, 5000); // Clear error message after 5 seconds
    }
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
  }, [dispatch, error, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    try {
      const config = {
        headers: { "content-Type": "application/json" },
      };
      const { data } = await axios.put(
        `${API_URL}/user`,
        {
          email,
          phoneNumber,
          name,
        },
        config
      );

      setSuccessMessage("User updated successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        setValidated(false);
      }, 5000); 
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value;
    setPhoneNumber(inputPhoneNumber);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="card-img-top"
            />
            <Card.Body>
              <h5 className="card-title text-center mb-4">Update User</h5>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your name.
                  </Form.Control.Feedback>
                </Form.Group>
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
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid phone number.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Button type="submit" className="w-100 mt-4">
                  Update User
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to={`/update-password`} className="btn btn-primary">
                  Change your password
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateUser;
