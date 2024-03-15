import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { API_URL } from "../../Links";


const NewPolicy = () => {
  const [formData, setFormData] = useState({
    policyType: "",
    policyTerm: "",
    paymentFrequency: "",
    premiumAmount: "",
    termsAndConditions: "",
    sumAssured: "",
  });
  const [formErrors, setFormErrors] = useState({
    policyType: "",
    policyTerm: "",
    paymentFrequency: "",
    premiumAmount: "",
    termsAndConditions: "",
    sumAssured: "",
  });
  const [errorMessage, setErrorMessage] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: value
        ? ""
        : `Please enter ${name.replace(/[A-Z]/g, match => ' ' + match.toLowerCase())}.`,
    });
  };

  

const handleSubmit = async (event) => {
  event.preventDefault();

  let isValid = true;
  const newFormErrors = { ...formErrors };

  for (const key in formData) {
    if (formData.hasOwnProperty(key) && formData[key] === "") {
      newFormErrors[key] = `Please enter ${key.replace(
        /[A-Z]/g,
        (match) => " " + match.toLowerCase()
      )}.`;
      isValid = false;
    }
  }

  

  const premiumAmount = parseFloat(formData.premiumAmount);
  if (premiumAmount <= 0) {
    newFormErrors.premiumAmount = "Premium amount must be a positive number.";
    isValid = false;
  }

  const sumAssured = parseFloat(formData.sumAssured);
  if (sumAssured < 0) {
    newFormErrors.sumAssured = "Sum assured must be a non-negative number.";
    isValid = false;
  }

  if (formData.policyTerm <= 0) {
    newFormErrors.policyTerm = "Policy Term must be greater than 0";
    isValid = false;
  }

  if (formData.policyTerm > 100) {
    newFormErrors.policyTerm = "Policy Term cannot be greater than 100";
    isValid = false;
  }

  if (formData.sumAssured > 100000000000) {
     newFormErrors.sumAssured =
       "Policy Sum Assured cannot be greater than 100000000000";
     isValid = false;
  }
  if (formData.premiumAmount > 100000000000) {
    newFormErrors.sumAssured =
      "Policy Premium Amount cannot be greater than 100000000000";
    isValid = false;
  }


    if (!isValid) {
      setFormErrors(newFormErrors);
      return;
    }

  try {
    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.post(`${API_URL}/policy`, formData, config);
    console.log(data);
    setSuccessMessage("Policy Created Successfully");
  } catch (e) {
    console.log(e);
    setErrorMessage(e.response.data.message);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  return (
    <div className="row">
      <h1 className="text-center">New Policy</h1>
      <div className="col-md-6 offset-md-3">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <form noValidate className="validated-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="policy-type">
              Policy Type:
            </label>
            <input
              className={`form-control ${
                formErrors.policyType ? "is-invalid" : ""
              }`}
              type="text"
              id="policy-type"
              name="policyType"
              value={formData.policyType}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.policyType}</div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="policyTerm">
              Policy Term (in years)
            </label>
            <input
              className={`form-control ${
                formErrors.policyTerm ? "is-invalid" : ""
              }`}
              type="text"
              id="policyTerm"
              name="policyTerm"
              value={formData.policyTerm}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{formErrors.policyTerm}</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="paymentFrequency">
              Payment Frequency:
            </label>
            <select
              className={`form-control ${
                formErrors.paymentFrequency ? "is-invalid" : ""
              }`}
              id="paymentFrequency"
              name="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Frequency</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <div className="invalid-feedback">
              {formErrors.paymentFrequency}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="premiumAmount">
              Premium Amount:
            </label>
            <div className="input-group">
              <span className="input-group-text" id="premium-amount-label">
                Rs.
              </span>
              <input
                type="text"
                className={`form-control ${
                  formErrors.premiumAmount ? "is-invalid" : ""
                }`}
                id="premiumAmount"
                placeholder="0.00"
                aria-label="premiumAmount"
                aria-describedby="premium-amount-label"
                name="premiumAmount"
                value={formData.premiumAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ color: "red" }}>{formErrors.premiumAmount}</div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="sumAssured">
              Sum Assured:
            </label>
            <div className="input-group">
              <span className="input-group-text" id="sum-assured-label">
                Rs.
              </span>
              <input
                type="text"
                className={`form-control ${
                  formErrors.sumAssured ? "is-invalid" : ""
                }`}
                id="sumAssured"
                placeholder="0.00"
                aria-label="sumAssured"
                aria-describedby="sum-assured-label"
                name="sumAssured"
                value={formData.sumAssured}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ color: "red" }}>{formErrors.sumAssured}</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="termsAndConditions">
              Terms And Conditions:
            </label>
            <textarea
              className={`form-control ${
                formErrors.termsAndConditions ? "is-invalid" : ""
              }`}
              id="termsAndConditions"
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleChange}
              required
            ></textarea>
            <div className="invalid-feedback">
              {formErrors.termsAndConditions}
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            Add Policy
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPolicy;
