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
        lastSavedLocation: {
            latitude: 0,
            longitude: 0
        },
        isLocationLoaded: false
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
        updateLastSavedLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.lastSavedLocation.latitude = latitude;
            state.lastSavedLocation.longitude = longitude;
        },
        setLastSavedLocation: (state, action) => {
            const { latitude, longitude } = action.payload
            AsyncStorage.setItem('@last_location', JSON.stringify({ latitude, longitude }))
        },
        setLocationLoaded: (state) => {
            state.isLocationLoaded = true;
        }
    }
})

export const { setGrantLoaded, updateLocationState, updateLocation, updateLastSavedLocation, setLastSavedLocation, setLocationLoaded } = locationSlice.actions;

export default locationSlice.reducer;