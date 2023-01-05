import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        scheme: "default",
        isDark: false,
        isLight: false,
        isDefault: true
    },
    reducers: {
        setSystemDefaultMode: (state, action) => {
            state.isDefault = true;
            const { isDark } = action.payload;
            state.isLight = !isDark;
            state.isDark = isDark;
            state.scheme = "default"
        },
        setDarkMode: (state) => {
            state.isDark = true;
            state.isDefault = false;
            state.isLight = false;
            state.scheme = "dark"
        },
        setLightMode: (state) => {
            state.isLight = true;
            state.isDefault = false;
            state.isDark = false;
            state.scheme = "light"
        }
    }

})

export const { setSystemDefaultMode, setDarkMode, setLightMode } = themeSlice.actions

export default themeSlice.reducer