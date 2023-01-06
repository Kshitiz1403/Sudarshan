import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, setLoaded, setLoading, setProfileCompleted, setProfileCompleteLoaded, setUser } from "../../store/reducers/authSlice";
import { getAuthenticatedAxios, getUnauthenticatedAxios } from "./baseConfig";
import config from "../../config";

const useAuthService = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token)

    const login = async (email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth');
            const data = await unauthenticatedAxios.post('/signin', { email, password });
            const token = `Bearer ${data['token']}`;
            await AsyncStorage.setItem('@token', token)
            dispatch(loginUser(token));
            dispatch(setUser(data['user']))
            return token;
        } catch (error) {
        }
    }

    const signup = async (email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth')
            const data = await unauthenticatedAxios.post('/signup', { email, password });
            const token = `Bearer ${data['token']}`;
            await AsyncStorage.setItem('@token', token)
            dispatch(loginUser(token))
            dispatch(setUser(data['user']))
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
            const user = await authenticatedAxios.get('/me')
            dispatch(loginUser(token));
            dispatch(setUser(user))
            return user;
        } catch (error) {
        }
        finally {
            dispatch(setLoaded())
        }
    }

    const isProfileComplete = async () => {
        try {
            const token = await AsyncStorage.getItem('@token');
            if (!token) return
            const authenticatedAxios = getAuthenticatedAxios('/users', token);
            const { isProfileComplete } = await authenticatedAxios.get('/profileStatus');
            if (isProfileComplete) dispatch(setProfileCompleted());
            dispatch(setProfileCompleteLoaded())
        } catch (error) { }
    }

    const completeProfile = async (name, dob, gender, weightKG, heightCM) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/users', token);
            const data = await authenticatedAxios.patch('/details', { name, dob, gender, weightKG, heightCM })
            dispatch(setProfileCompleted());
            return data;
        } catch (error) {
        }
    }


    return { login, signup, logout, forgot, reset, getUserFromToken, isProfileComplete, completeProfile }
}

export default useAuthService;