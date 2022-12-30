import { createSlice } from "@reduxjs/toolkit";

export const dustbinSlice = createSlice({
    name: "dustbin",
    initialState: {
        dustbins: [],
        selectedDustbin: {},
        selectedIndex: -1,
    },
    reducers: {
        setDustbins: (state, action) => {
            const dustbins = action.payload;
            state.dustbins = dustbins;
        },
        selectDustbin: (state, action) => {
            const { index } = action.payload;
            if (index == -1) {
                resetDustbin();
                return;
            }
            state.selectedIndex = index;
            state.selectedDustbin = state.dustbins[index];
        },
        resetDustbin: (state) => {
            state.selectedIndex = -1;
            state.selectedDustbin = {}
        }
    }
})

export const { setDustbins, selectDustbin, resetDustbin } = dustbinSlice.actions;

export default dustbinSlice.reducer;