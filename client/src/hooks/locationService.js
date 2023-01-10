import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setGrantLoaded, setLocationLoaded, updateLocation, updateLocationState } from '../store/reducers/locationSlice';
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

    const watchCurrentLocation = async () => {
        return new Promise((resolve, reject) => {
            return Geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                dispatch(updateLocation({ latitude, longitude }));
                dispatch(setLocationLoaded());
                return resolve({ latitude, longitude });
            }, (err) => {
                return reject(err);
            }, {
                enableHighAccuracy: true,
                interval: 10000,
                distanceFilter: 50
            })
        })
    }

    const updateLastSavedLocationInStorage = ({ latitude, longitude }) => {
        if (latitude && longitude) {
            AsyncStorage.setItem('@last_location', JSON.stringify({ latitude, longitude }));
        }
    }

    const triggerUpdatingLastLocation = async ({ latitude, longitude }) => {
        updateLastSavedLocationInStorage({ latitude, longitude })
        const intervalId = setInterval(() => {
            updateLastSavedLocationInStorage({ latitude, longitude });
        }, 30000); //30 sec
        return intervalId;
    }

    const getLastSavedLocation = async () => {
        try {
            const lastSavedLocation = await AsyncStorage.getItem('@last_location');
            if (lastSavedLocation == null) return;
            const { latitude, longitude } = JSON.parse(lastSavedLocation);
            dispatch(updateLocation({ latitude, longitude }));
            dispatch(setLocationLoaded())
        } catch (error) {
        }
    }

    return { checkPermissionGranted, askForLocationPermission, watchCurrentLocation, triggerUpdatingLastLocation, getLastSavedLocation }

}

export default useLocationService;