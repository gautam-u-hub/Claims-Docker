import { configureStore } from "@reduxjs/toolkit";
import policySlice from "./policies-slice";
import userSlice from "./user-slice";
import storage from "redux-persist/lib/storage";

import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import errorSlice from "./error-slice";



const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const reducer = combineReducers({
    policy: policySlice.reducer,
    user: userSlice.reducer,
    error:errorSlice.reducer

})
const persistedReducer = persistReducer(persistConfig,reducer);



const store = configureStore({
    reducer: persistedReducer
});

export default store;