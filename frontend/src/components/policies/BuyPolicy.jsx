import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { API_URL } from "../../Links";

const BuyPolicy = () => {
  const Navigate = useNavigate();
  const { policyId } = useParams();
  const user = useSelector((state) => state.user.user.user);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log(policy);
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const policy = useSelector((state) => {
    const policies = state.policy.policies.policies;
    return policies.find((policy) => policy._id === policyId) || null;
  });

  const buyPolicy = async () => {
    try {
      const config = {
        headers: { "content-Type": "application/json" },
      };
      await axios.put(`${API_URL}/buy-policy/${policyId}`, {}, config);
      setSuccessMessage("Policy added to your account successfully");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Policy Details</h1>
      <div className="card">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="card-body">
          <div className="mb-3">
            <h5 className="card-title">Policy Type</h5>
            <p className="card-text font-weight-bold">{policy.policyType}</p>
          </div>

          <hr />
          <div className="mb-3">
            <h5 className="card-title">Premium Amount</h5>
            <p className="card-text font-weight-bold">
              Rs. {policy.premiumAmount}
            </p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Sum Assured</h5>
            <p className="card-text font-weight-bold">
              Rs. {policy.sumAssured}
            </p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Terms and Conditions</h5>
            <p className="card-text font-weight-bold">
              {policy.termsAndConditions}
            </p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Policy Term (in years)</h5>
            <p className="card-text font-weight-bold">{policy.policyTerm}</p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Payment Frequency</h5>
            <p className="card-text font-weight-bold">
              {policy.paymentFrequency}
            </p>
          </div>

          {user.role === "policyHolder" && (
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={buyPolicy}>
                Buy Policy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyPolicy;
