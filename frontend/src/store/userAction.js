import { errorActions } from "./error-slice";
import { userAction } from "./user-slice";
import axios from "axios";
import { API_URL } from "../Links";

export const loginUser = ({ email, password }) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: { "content-type": "application/json" },
            };

            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
            dispatch(userAction.loginUser({
                user: data.user,
                isAuthenticated: true
            }));

        } catch (error) {
            dispatch(errorActions.showError({
                message: error.response.data.message
            }));
        }
    }
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await axios.get(`${API_URL}/auth/logout`);
            dispatch(userAction.logoutUser({
                message: "success"
            }));
        } catch (error) {
            dispatch(errorActions.showError({
                message: error.response.data.message
            }));
        }
    }
};

export const registerUser = ({ email, name, password, phoneNumber }) => {
    return async (dispatch) => {
        try {
            const config = {
                headers: { "content-type": "application/json" },
            };
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password, phoneNumber }, config);
            dispatch(userAction.registerUser({
                user: data.user
            }));
        } catch (error) {
            dispatch(errorActions.showError({
                message: error.response.data.message
            }));
        }
    }
};


export const clearErrors = () => {
    return async (dispatch) => {
        dispatch(errorActions.clearErrors({
            error: null
        }))
    }

}
