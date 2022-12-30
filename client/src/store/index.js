import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import dustbinReducer from "./reducers/dustbinSlice";
import locationReducer from "./reducers/locationSlice";
import onboardingReducer from "./reducers/onboardingSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        onboarding: onboardingReducer,
        location: locationReducer,
        dustbin: dustbinReducer
    },
});