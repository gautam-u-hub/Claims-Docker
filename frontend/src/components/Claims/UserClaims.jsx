import React, { useState, useEffect } from "react";
import image from "../../Images/Random.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Links";

const AllClaims = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(`${API_URL}/claims`);
        setClaims(response.data.claims);
        
      } catch (error) {
        setError(error.response.data.message);
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
        <h1>Your Claims</h1>
        {error && <p className="alert alert-danger">Error: {error}</p>}

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
                      Creation Date:{" "}
                      {new Date(claim.claimDate).toLocaleDateString("en-GB")}
                    </small>
                  </p>
                  <Link
                    to={`/user-claims/${claim._id}`}
                    className="btn btn-primary"
                  >
                    Show Claim
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
