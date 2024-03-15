import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import background from "../../Images/pxfuel.jpg";

const Home = () => {
  const user = useSelector((state) => state.user.user.user);

  return (
    <div
      className="container-fluid p-0 d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${background})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <h1 className="display-20 text-black mb-4">
        Welcome to Claim Management System
      </h1>
      <div className="text-center">
        {user ? (
          <>
            
            {["admin", "TPA", "policyHolder"].includes(user.role) && (
              <Link to="/all-policies" className="btn btn-lg btn-primary mb-2">
                All Policies
              </Link>
            )}
          </>
        ) : (
          <Link to="/login" className="btn btn-lg btn-primary mb-2">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
