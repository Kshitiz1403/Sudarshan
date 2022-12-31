import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import { useDispatch } from 'react-redux';
import { setGrantLoaded, setLocationLoaded, updateLastSavedLocation, updateLocation, updateLocationState } from '../store/reducers/locationSlice';

const useLocationService = () => {

    const dispatch = useDispatch()

    const isPermissionGranted = async () => {
        try {
            const status = await Location.getForegroundPermissionsAsync()
            dispatch(updateLocationState({ ...status }))
            return status.granted;
        } catch (error) {
        }
        finally {
            dispatch(setGrantLoaded())
        }
    }
    const askForLocationPermission = async () => {
        const response = await Location.requestForegroundPermissionsAsync()
        const status = response;
        dispatch(updateLocationState({ ...status }))
        return isPermissionGranted();
    }

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({ accuracy: 4 });
            const { latitude, longitude } = location.coords;
            dispatch(updateLocation({ latitude, longitude }));
        } catch (error) {
            console.error(error)
        }
        finally {
            dispatch(setLocationLoaded());
        }
    }

    const getLastSavedLocation = async () => {
        try {
            const lastSavedLocation = await AsyncStorage.getItem('@last_location');
            if (!lastSavedLocation) return;
            const { latitude, longitude } = JSON.parse(lastSavedLocation);
            dispatch(updateLastSavedLocation({ latitude, longitude }));
        } catch (error) {
        }
        // finally {
        //     dispatch(setLocationLoaded());
        // }
    }

    return { isPermissionGranted, askForLocationPermission, getCurrentLocation, getLastSavedLocation }

}

export default useLocationService;