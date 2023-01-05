import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode, setLightMode, setSystemDefaultMode } from "../store/reducers/themeSlice";
import mapDarkTheme from "./mapDarkTheme";

const useThemeService = () => {

    const dispatch = useDispatch();

    const defaultDeviceScheme = useColorScheme();

    const theme = useSelector(state => state.theme)

    const mountTheme = async () => {
        const theme = await AsyncStorage.getItem('@theme');
        if (theme == null || theme == 'default') {
            if (defaultDeviceScheme == 'dark') dispatch(setSystemDefaultMode({ isDark: true }));
            else dispatch(setSystemDefaultMode({ isDark: false }));
            return
        }
        if (theme == 'dark') {
            dispatch(setDarkMode());
            return;
        }
        if (theme == 'light') {
            dispatch(setLightMode());
            return;
        }
    }

    const updateThemePreference = async ({ system_default = false, dark = false, light = false }) => {
        if (system_default) {
            AsyncStorage.setItem('@theme', 'default');
            if (defaultDeviceScheme == 'dark') dispatch(setSystemDefaultMode({ isDark: true }));
            else dispatch(setSystemDefaultMode({ isDark: false }));
        }
        else if (dark) {
            AsyncStorage.setItem('@theme', 'dark');
            dispatch(setDarkMode());
        }
        else if (light) {
            AsyncStorage.setItem('@theme', 'light');
            dispatch(setLightMode());
            return;
        }
    }

    const themeForMap = () => {
        if (theme.isDark) {
            const mapTheme = mapDarkTheme;
            return mapTheme;
        }
        return [];
    }

    return { mountTheme, updateThemePreference, themeForMap }

}

export default useThemeService;