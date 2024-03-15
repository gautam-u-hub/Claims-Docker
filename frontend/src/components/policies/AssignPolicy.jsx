import React, { useEffect } from "react";

const AssignPolicy = () => {
  const policy = {
    policyType: "General Insurance",
    startDate: "2024-03-01",
    endDate: "2025-03-01",
    premiumAmount: 5000,
    sumAssured: 1000000,
    termsAndConditions:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel...",
    policyTerm: "1 year",
    paymentFrequency: "Monthly",
  };

  useEffect(() => {
    
  }, []);
  return (
    <div className="container">
      <h1 className="text-center mb-4">Policy Details</h1>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <h5 className="card-title">Policy Type</h5>
            <p className="card-text font-weight-bold">{policy.policyType}</p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Start Date</h5>
            <p className="card-text font-weight-bold">{policy.startDate}</p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">End Date</h5>
            <p className="card-text font-weight-bold">{policy.endDate}</p>
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
            <h5 className="card-title">Policy Term</h5>
            <p className="card-text font-weight-bold">{policy.policyTerm}</p>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="card-title">Payment Frequency</h5>
            <p className="card-text font-weight-bold">
              {policy.paymentFrequency}
            </p>
          </div>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Assign Policy</h5>
          <form >
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Applicant's Email
              </label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                value={""}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Assign Policy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignPolicy;
