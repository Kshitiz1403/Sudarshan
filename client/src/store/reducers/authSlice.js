import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isLoading: true,
        isLoggedIn: false
    },
    reducers: {
        loginUser: (state, action) => {
            state.isLoggedIn = true
            state.isLoading = false;
            const token = action.payload;
            state.token = token
        },
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.token = "";
        },
        setLoaded: (state) => {
            state.isLoading = false;
        },
        setLoading: (state) => {
            state.isLoading = true;
        }
    }
})

export const { loginUser, logoutUser, setLoaded, setLoading } = authSlice.actions

export default authSlice.reducer