import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        isPermissionGranted: false,
        canAskAgain: true,
        status: "",
        expires: "",
        latitude: 0,
        longitude: 0,
        lastSavedLocation: {
            latitude: 0,
            longitude: 0
        },
        isLocationLoaded: false
    },
    reducers: {
        updateLocationState: (state, action) => {
            const { canAskAgain, status, granted, expires } = action.payload
            state.canAskAgain = canAskAgain;
            state.status = status;
            state.isPermissionGranted = granted;
            state.expires = expires;
        },
        updateLocation: (state, action) => {
            const { latitude, longitude } = action.payload
            state.latitude = latitude
            state.longitude = longitude
        },
        updateLastSavedLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.lastSavedLocation.latitude = latitude;
            state.lastSavedLocation.longitude = longitude;
        },
        setLastSavedLocation: (state, action) => {
            const { latitude, longitude } = action.payload
            AsyncStorage.setItem('@last_location', JSON.stringify({ latitude, longitude }))
        },
        setLocationLoaded: (state) =>{
            state.isLocationLoaded = true;
        }
    }
})

export const { updateLocationState, updateLocation, updateLastSavedLocation, setLastSavedLocation, setLocationLoaded } = locationSlice.actions;

export default locationSlice.reducer;