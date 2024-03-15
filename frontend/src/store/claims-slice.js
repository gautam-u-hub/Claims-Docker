import { createSlice } from "@reduxjs/toolkit";

const claimSlice = createSlice({
    name: 'claims',
    initialState: {
        claims: {},
        error: null 
    },
    reducers: {
        createClaimSuccess(state, action) {
            state.claims = action.payload;
            state.error = null;
        },
        createClaimFailed(state, action) {
            state.error = action.payload; 
        }
    }
});

export const { createClaimSuccess, createClaimFailed } = claimSlice.actions;

export default claimSlice.reducer;
