import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import dustbinReducer from "./reducers/dustbinSlice";
import locationReducer from "./reducers/locationSlice";
import onboardingReducer from "./reducers/onboardingSlice";
import themeReducer from "./reducers/themeSlice";
import tripReducer from "./reducers/tripSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        onboarding: onboardingReducer,
        location: locationReducer,
        dustbin: dustbinReducer,
        theme: themeReducer,
        trip: tripReducer
    },
});