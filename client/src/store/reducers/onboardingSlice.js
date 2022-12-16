import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const onboardingSlice = createSlice({
    name: "onboarding",
    initialState: {
        isOnboarded: false
    },
    reducers: {
        completeOnboarding: (state) => {
            state.isOnboarded = true;
            AsyncStorage.setItem('@onboarded', 'true')
        }
    }
})
export const { completeOnboarding } = onboardingSlice.actions;

export default onboardingSlice.reducer;