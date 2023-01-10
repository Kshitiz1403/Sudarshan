import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tripId: "",
    isStarted: false,
    selectedDustbin: {},
    selectedLocation: {
        latitude: null,
        longitude: null
    }
}
export const tripSlice = createSlice({
    name: "trip",
    initialState,
    reducers: {
        startTripAction: (state, action) => {
            state.isStarted = true;
            const { selectedDustbin, selectedLocation, id } = action.payload;
            state.selectedDustbin = selectedDustbin;
            state.selectedLocation = selectedLocation;
            state.tripId = id;
        },
        endTripAction: (state, action) => {
            return initialState;
        }

    }
})

export const { startTripAction, endTripAction } = tripSlice.actions

export default tripSlice.reducer;