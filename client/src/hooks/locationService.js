import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location'
import { PermissionsAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import { setGrantLoaded, setLocationLoaded, updateLastSavedLocation, updateLocation, updateLocationState } from '../store/reducers/locationSlice';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, request } from 'react-native-permissions';


const useLocationService = () => {

    const dispatch = useDispatch()

    const checkPermissionGranted = async () => {
        try {
            const isGranted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (isGranted == 'granted') {
                dispatch(updateLocationState({ isPermissionGranted: true }));
                return true;
            }
            if (isGranted == 'blocked') {
                dispatch(updateLocationState({ canAskAgain: false }));
                return false;
            }
            if (isGranted == 'denied') {
                dispatch(updateLocationState({ isPermissionGranted: false }));
                return false;
            }
        } catch (error) {
            console.error(error)
        }
        finally {
            dispatch(setGrantLoaded())
        }
    }
    const askForLocationPermission = async () => {
        const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (status == 'granted') {
            dispatch(updateLocationState({ isPermissionGranted: true }));
            return true;
        }
        if (status == 'denied') {
            dispatch(updateLocationState({ isPermissionGranted: false }));
            return false;
        }
        if (status == 'blocked') {
            dispatch(updateLocationState({ canAskAgain: false }));
            return false;
        }
    }

    const getCurrentLocation = async () => {
        try {
            return Geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                dispatch(updateLocation({ latitude, longitude }));
                return { latitude, longitude };
            }, (err) => {
                throw err
            }, {
                enableHighAccuracy: true
            })
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

    return { checkPermissionGranted, askForLocationPermission, getCurrentLocation, getLastSavedLocation }

}

export default useLocationService;