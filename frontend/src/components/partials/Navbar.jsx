import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/userAction";
import { useNavigate } from "react-router-dom";


function CustomNavbar() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    
    navigate("/");
    
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">Claims Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {currentUser.user && (
              <>
                <Nav.Link href="/">Hello {currentUser.user.name}</Nav.Link>
                <Nav.Link href="/update-user">Update Profile</Nav.Link>
              </>
            )}
            <Nav.Link href="/">Home</Nav.Link>
            {currentUser.user && currentUser.user.role === "policyHolder" && (
              <>
                <Nav.Link href="/your-policies">Your Policies</Nav.Link>
                <Nav.Link href="/your-claims">Your Claims</Nav.Link>
              </>
            )}
            {currentUser.user && currentUser.user.role !== "policyHolder" && (
              <>
                <Nav.Link href="/all-claims">All Claims</Nav.Link>
              </>
            )}

            {currentUser.user && currentUser.user.role === "admin" && (
              <>
                <Nav.Link href="/new-policy">New Plan </Nav.Link>
                <Nav.Link href="/all-users">All Users </Nav.Link>
              </>
            )}
            <Nav.Link href="/all-policies">All Plans</Nav.Link>
          </Nav>
          <Nav>
            {!currentUser.user ? (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
