import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../Links";

const ClaimDetails = () => {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/claims/${claimId}`);
        setClaim(response.data.claim);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchData();
  }, [claimId]);

  const deleteClaim = async (event) => {
    try {
      const config = {
        headers: { "content-Type": "application/json" },
      };

      await axios.delete(`${API_URL}/claims/${claimId}`, config);
      alert("Claim deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting claim:", error);
    }
  };

  const updateClaim = async (event) => {
    navigate(`/update-claims/${claimId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-success";
      case "Rejected":
        return "text-danger";
      case "Pending":
        return "text-warning";
      default:
        return "text-muted";
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Claim Details</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {claim && (
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <h5 className="card-title">Policy ID</h5>
                  <p className="card-text">{claim._id}</p>
                </div>
                <div className="mb-3">
                  <h5 className="card-title">Claim Date</h5>
                  <p className="card-text">
                    {new Date(claim.claimDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="mb-3">
                  <h5 className="card-title">Claim Amount</h5>
                  <p className="card-text">Rs. {claim.claimAmount}</p>
                </div>
                <div className="mb-3">
                  <h5 className="card-title">Description</h5>
                  <p className="card-text">{claim.description}</p>
                </div>
                <div className={`fw-bold ${getStatusColor(claim.status)}`}>
                  <h5 className="card-title">Status</h5>
                  <p className="card-text">{claim.status}</p>
                </div>
                <div className="d-grid gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={deleteClaim}
                  >
                    Delete Claim
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={updateClaim}
                  >
                    Update Claim
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
