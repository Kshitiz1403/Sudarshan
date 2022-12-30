import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isLoading: true,
        isLoggedIn: false,
        isProfileCompleteLoading: true,
        isProfileComplete: false,
        user: {}
    },
    reducers: {
        loginUser: (state, action) => {
            state.isLoggedIn = true
            state.isLoading = false;
            const token = action.payload;
            state.token = token
            AsyncStorage.setItem('@token', token)
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        logoutUser: (state) => {
            AsyncStorage.removeItem('@token')
            state.isLoggedIn = false;
            state.token = "";
        },
        setLoaded: (state) => {
            state.isLoading = false;
        },
        setLoading: (state) => {
            state.isLoading = true;
        },
        setProfileCompleteLoaded: (state) => {
            state.isProfileCompleteLoading = false;
        },
        setProfileCompleted: (state) => {
            state.isProfileComplete = true;
        }
    }
})

export const { loginUser, setUser, logoutUser, setLoaded, setLoading, setProfileCompleteLoaded, setProfileCompleted } = authSlice.actions

export default authSlice.reducer