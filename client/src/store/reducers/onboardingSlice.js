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
        },
        reonboard: (state) =>{
            state.isOnboarded = false;
            AsyncStorage.removeItem('@onboarded');
        }
    }
})
export const { completeOnboarding, reonboard } = onboardingSlice.actions;

export default onboardingSlice.reducer;