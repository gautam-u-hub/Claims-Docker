import { createClaimSuccess, createClaimFailed } from "./claims-slice";
import axios from "axios";

let error1 = "";

export const getError = () => error1;

export const createClaim = ({ policyId, claimDate, claimAmount, description }) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: { "content-Type": "application/json" },
            };

            const { data } = await axios.post(`http://localhost:4000/claims/${policyId}`, { claimDate, claimAmount, description }, config);
            console.log(data);
            dispatch(createClaimSuccess({
                claims: data.claim
            }));
        } catch (error) {
            error1 = error.response.data.message || "An error occurred";
            dispatch(createClaimFailed(error1));
        }
    };
};
