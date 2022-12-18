import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        isPermissionGranted: false,
        canAskAgain: true,
        status: "",
        expires: "",
    },
    reducers: {
        grantPermission: (state) => {
            state.isPermissionGranted = false;
        },
        updateLocationState: (state, action) => {
            const { canAskAgain, status, granted, expires } = action.payload
            state.canAskAgain = canAskAgain;
            state.status = status;
            state.isPermissionGranted = granted;
            state.expires = expires;
        }
    }
})

export const { updateLocationState } = locationSlice.actions;

export default locationSlice.reducer;