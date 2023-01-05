import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { completeOnboarding } from "../store/reducers/onboardingSlice";

const useOnboardingService = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await initializeOnboardingValue()
        })();
    }, [])

    const initializeOnboardingValue = async () => {
        const isOnboarded = await AsyncStorage.getItem('@onboarded')
        if (isOnboarded === 'true') {
            dispatch(completeOnboarding())
            return true;
        };
        return false;
    }

}

export default useOnboardingService