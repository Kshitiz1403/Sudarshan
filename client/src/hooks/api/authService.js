import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser, setLoaded, setLoading } from "../../store/reducers/authSlice";
import { getAuthenticatedAxios, getUnauthenticatedAxios } from "./baseConfig";

const useAuthService = () => {
    const dispatch = useDispatch();

    const login = async (email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth');
            const data = await unauthenticatedAxios.post('/signin', { email, password });
            const token = `Bearer ${data['token']}`;
            dispatch(loginUser(token));
            return token;
        } catch (error) {
        }
    }

    const signup = async (email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth')
            const data = await unauthenticatedAxios.post('/signup', { email, password });
            const token = `Bearer ${data['token']}`;
            dispatch(loginUser(token))
            return token;
        } catch (error) {
        }
    }

    const logout = () => {
        dispatch(logoutUser())
    }

    const forgot = async (email) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth');
            const data = await unauthenticatedAxios.post('/forgot', { email });
            return data
        } catch (error) {
        }
    }

    const reset = async (email, otp, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth');
            const data = await unauthenticatedAxios.post('/reset', { email, otp, password });
            const token = `Bearer ${data['token']}`;
            dispatch(loginUser(token));
            return token;
        } catch (error) {
        }
    }

    const getUserFromToken = async () => {
        try {
            dispatch(setLoading())
            const token = await AsyncStorage.getItem('@token');
            if (!token) return;
            const authenticatedAxios = getAuthenticatedAxios('/users', token);
            const user = await authenticatedAxios.get('/me').data;
            dispatch(loginUser(token));
            return user;
        } catch (error) {
        }
        finally {
            dispatch(setLoaded())
        }
    }

    return { login, signup, logout, forgot, reset, getUserFromToken }
}

export default useAuthService;