import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        isGrantLoading: true,
        isPermissionGranted: false,
        isDisabled: false, //Location service is disabled
        canAskAgain: true,
        latitude: 0,
        longitude: 0,
        isLocationLoaded: false,
        destinationLocation: {
            latitude: null,
            longitude: null
        }
    },
    reducers: {
        setGrantLoaded: (state) => {
            state.isGrantLoading = false;
        },
        updateLocationState: (state, action) => {
            const { isPermissionGranted = state.isPermissionGranted, canAskAgain = state.canAskAgain, isDisabled = state.isDisabled } = action.payload
            state.isPermissionGranted = isPermissionGranted;
            state.canAskAgain = canAskAgain;
            state.isDisabled = isDisabled
        },
        updateLocation: (state, action) => {
            const { latitude, longitude } = action.payload
            state.latitude = latitude
            state.longitude = longitude
        },
        setLocationLoaded: (state) => {
            state.isLocationLoaded = true;
        },
        setDestinationLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.destinationLocation.latitude = latitude;
            state.destinationLocation.longitude = longitude;
        }
    }
})

export const { setGrantLoaded, updateLocationState, updateLocation, setLocationLoaded, setDestinationLocation } = locationSlice.actions;

export default locationSlice.reducer;