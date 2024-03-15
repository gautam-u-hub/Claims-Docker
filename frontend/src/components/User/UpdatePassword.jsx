import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Links";
import axios from "axios";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.put(
        `${API_URL}/user/password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        config
      );
      console.log(data);
      setSuccessMessage("Password Updated Successfully");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };
  useEffect(() => {
    const clearMessages = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(clearMessages);
  }, [successMessage, errorMessage]);
  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="card-title text-center mb-4">Update Password</h5>
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
                <Form.Group controlId="formOldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your old password.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8} // Minimum length of 8 characters
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a new password with a minimum of 8 characters.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please confirm your new password.
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="w-100 mt-4">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdatePassword;
