import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Links";

const ForgotPasswordReset = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      await axios.put(
        `${API_URL}/password/reset/${token}`,
        { password, confirmPassword },
        config
      );
    } catch (error) {}
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <div className="card shadow">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="card-img-top"
            />
            <div className="card-body">
              <h5>Reset Password</h5>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="formBasicPassword">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group
                    as={Col}
                    md="12"
                    controlId="formBasicConfirmPassword"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                  Reset Password
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
