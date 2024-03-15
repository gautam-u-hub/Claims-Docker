import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginUser } from "../../store/userAction";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);

  const { user } = useSelector((state) => state.user.user) || {};
  const error = useSelector((state) => state.error);

  useEffect(() => {
    if (error && error.error) {
      setErrorMessage(error.error);
      dispatch(clearErrors());
    }
    if (user && user.name.length > 0) {
      navigate("/");
    }
  }, [dispatch, error, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      try {
        await dispatch(loginUser({ email, password }));
      } catch (e) {
        console.error("Login failed:", e);
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const forgotPasswordSubmit = (event) => {
    navigate("/forgot-password");
  }

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
          <Card className="shadow">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="card-img-top"
            />
          </Card>
          <br></br>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <br />
          <h5 className="card-title">Login with email</h5>
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
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationCustomPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    aria-describedby="inputGroupPrepend"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a password.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Button type="submit">Login</Button>
          </Form>
          <br />
          <Button variant="link" onClick={forgotPasswordSubmit}>Forgot Password?</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
