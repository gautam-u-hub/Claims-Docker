import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { API_URL } from "../../Links";

const UpdatePayment = () => {
  const [user, setUser] = useState({});
  const { policyId } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
    const [inpErrorMessage, setInpErrorMessage] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);
  const [lastPaymentDate, setLastPaymentDate] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/user`);
        setUser(data.user);
      } catch (error) {
        setErrorMessage(error.data.response.message);

      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.policies) {
      const policy = user.policies.find((policy) => policy._id === policyId);
      if (policy) {
        setLastPaymentDate(policy.lastPremiumPayment);
      }
    }
  }, [user, policyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    
    

    if (!lastPaymentDate) {
      setInpErrorMessage("Please select a valid date.");
      setTimeout(() => {
        setInpErrorMessage(null);
      }, 5000);
      return;
    }

    try {
      const config = {
        headers: {
          "content-Type": "application/json",
        },
      };

      await axios.put(
        `${API_URL}/user/policy/${policyId}`,
        { lastPremiumPayment: lastPaymentDate },
        config
      );

      setSuccessMessage("Updated Last Premium Payment Date");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 15000);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 15000);
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">Change the last premium payment date</h1>
      <div className="col-md-6 offset-md-3">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <form
          noValidate
          className={validated ? "was-validated" : ""}
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label className="form-label" htmlFor="lastPaymentDate">
              Last Premium Payment Date:
            </label>
            <DatePicker
              className="form-control"
              selected={lastPaymentDate}
              onChange={(date) => setLastPaymentDate(date)}
              dateFormat="dd/MM/yyyy"
              id="lastPaymentDate"
              required
            />
            <div style={{ color: "red" }}>{ inpErrorMessage }</div>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePayment;
