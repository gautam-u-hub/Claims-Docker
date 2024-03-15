import React, { useEffect,useState } from "react";
import image from "../../Images/Random.jpg";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserPolicies } from "../../store/policyActions";
import { Link } from "react-router-dom";

const UserPolicies = () => {
  const dispatch = useDispatch();
  const policies = useSelector((state) => state.policy.policies.policies) || [];
  const [error, setError] = useState(null);
  useEffect(() => {
    dispatch(getAllUserPolicies());
    if (policies.length === 0) {
    }
  }, [dispatch]);

  return (
    <>
      <div className="container">
        <h1>All Policies</h1>
        {error && <p className="alert alert-danger">Error: {error}</p>}

        {policies.map((policy, index) => (
          <div className="card mb-3" key={index}>
            <div className="row">
              <div className="col-md-3">
                <div className="image-wrapper d-flex align-items-center">
                  <img src={image} alt="" className="img-fluid" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{policy.policyType}</h5>
                  <p className="card-text">{policy.termsAndConditions}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Rs. {policy.premiumAmount}
                    </small>
                  </p>
                  <Link
                    to={`/show-policy/${policy._id}`}
                    className="btn btn-primary"
                  >
                    Show Policy
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

export default UserPolicies;
