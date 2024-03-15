import React, { useState, useEffect } from "react";
import image from "../../Images/Random.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { API_URL } from "../../Links";
const AllClaims = () => {
  const [claims, setClaims] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(`${API_URL}/TPA/claims`);
        setClaims(response.data.claims);
      } catch (error) {
        setErrorMessage("Error fetching claims");
        console.error("Error fetching claims:", error.data.response);
      }
    };

    fetchClaims();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
        return "orange";
      default:
        return "green";
    }
  };

  
  return (
    <>
      <div className="container">
        <h1>All Claims</h1>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {claims.map((claim, index) => (
          <div className="card mb-3" key={index}>
            <div className="row">
              <div className="col-md-3">
                <div className="image-wrapper d-flex align-items-center">
                  <img src={image} alt="" className="img-fluid" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Amount: {claim.claimAmount}</h5>
                  <p
                    className="card-text"
                    style={{
                      color: getStatusColor(claim.status), 
                    }}
                  >
                    Status: {claim.status}
                  </p>

                  <p className="card-text">
                    <small className="text-muted">
                      Creation Date: {claim.claimDate}
                    </small>
                  </p>
                  <Link
                    to={`/change-claim/${claim._id}`}
                    className="btn btn-primary"
                  >
                    Change Claim Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllClaims;
