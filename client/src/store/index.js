import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import onboardingReducer from "./reducers/onboardingSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        onboarding: onboardingReducer
    },
});