import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { API_URL } from "../../Links";

const UpdateClaims = () => {
  const { claimId } = useParams();
  const [claim, setClaim] = useState({
    claimAmount: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const claimDate = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/claims/${claimId}`);
        setClaim(response.data.claim);
      } catch (error) {
        setError("Error fetching data");
      }
    };

    fetchData();

    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timeout);
    }

    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!claim.claimAmount || !claim.description) {
      setError("Please fill in all required fields.");
      return;
    }
    if (claim.claimAmount < 0) {
      setError("Claim Amount cannot be negative");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        `${API_URL}/claims/${claimId}`,
        {...claim },
        config
      );
      console.log(data);

      setSuccess("Claim Updated Successfully");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">Update Claim</h1>
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
            <label className="form-label" htmlFor="price">
              Claim Amount
            </label>
            <div className="input-group">
              <span className="input-group-text" id="price-label">
                Rs.
              </span>
              <input
                type="text"
                className={`form-control ${!claim.claimAmount && "is-invalid"}`}
                id="price"
                placeholder="0.00"
                aria-label="price"
                aria-describedby="price-label"
                name="claimAmount"
                required
                value={claim.claimAmount}
                onChange={(e) =>
                  setClaim({ ...claim, claimAmount: e.target.value })
                }
              />
              {!claim.claimAmount && (
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
              className={`form-control ${!claim.description && "is-invalid"}`}
              id="description"
              name="description"
              required
              value={claim.description}
              onChange={(e) =>
                setClaim({ ...claim, description: e.target.value })
              }
            ></textarea>
            {!claim.description && (
              <div className="invalid-feedback">Description is required.</div>
            )}
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-success">
              Update Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClaims;
