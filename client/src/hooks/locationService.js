import * as Location from 'expo-location'
import { useDispatch } from 'react-redux';
import { updateLocationState } from '../store/reducers/locationSlice';

const useLocationService = () => {

    const dispatch = useDispatch()

    const isPermissionGranted = async () => {
        const status = await Location.getForegroundPermissionsAsync()
        console.log(status)
        dispatch(updateLocationState({ ...status }))
        return status.granted;   
    }
    const askForLocationPermission = async () => {
        const response = await Location.requestForegroundPermissionsAsync()
        const status = response;
        dispatch(updateLocationState({...status}))
        return isPermissionGranted();
    }

    return { isPermissionGranted, askForLocationPermission }

}

export default useLocationService;