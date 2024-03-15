import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { API_URL } from "../../Links";

const ApplyClaim = () => {
  const { policyId } = useParams();
  const [claimAmount, setClaimAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const claimDate = new Date();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!policyId || !claimAmount || !description) {
      setError("Please fill in all required fields.");
      return;
    }
    if (claimAmount < 0) {
      setError("Claim Amount cannot be negative");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        `${API_URL}/claims/${policyId}`,
        { claimDate, claimAmount, description },
        config
      );
      console.log(data);

      setSuccess("Claim Created Successfully");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">Application for claim </h1>
      <div className="col-md-6 offset-md-3">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="validated-form"
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Policy Id:
            </label>
            <input
              className={`form-control ${!policyId && "is-invalid"}`}
              type="text"
              id="policyId"
              name="policyId"
              required
              value={policyId}
              readOnly
            />
            {!policyId && (
              <div className="invalid-feedback">Policy Id is required.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="location">
              Claim Date:
            </label>
            <input
              className="form-control"
              type="text"
              id="claimDate"
              name="claimDate"
              required
              value={new Date().toLocaleDateString("en-GB")}
              readOnly
            />
            <div className="valid-feedback">Looks good!</div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="price">
              Claim Amount
            </label>
            <div className="input-group">
              <span className="input-group-text" id="price-label">
                Rs.
              </span>
              <input
                type="text"
                className={`form-control ${!claimAmount && "is-invalid"}`}
                id="price"
                placeholder="0.00"
                aria-label="price"
                aria-describedby="price-label"
                name="claimAmount"
                required
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
              {!claimAmount && (
                <div className="invalid-feedback">
                  Claim Amount is required.
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className={`form-control ${!description && "is-invalid"}`}
              id="description"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {!description && (
              <div className="invalid-feedback">Description is required.</div>
            )}
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-success">
              Apply For Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyClaim;
