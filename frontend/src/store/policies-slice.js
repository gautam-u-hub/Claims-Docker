import { createSlice } from "@reduxjs/toolkit";

const policySlice = createSlice({
    name: 'policy',
    initialState: {
        policies: []
    },
    reducers: {
        getAllPolicies(state, action) {
            state.policies=action.payload
        },
        getAllUserPolicies(state, action) {
            state.policies=action.payload
        }

    }
});

export const policyActions = policySlice.actions;
export default policySlice;