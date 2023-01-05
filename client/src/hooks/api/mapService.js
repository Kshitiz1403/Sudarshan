import { useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig"

const useMapService = () => {
    const token = useSelector(state => state.auth.token)

    const autoComplete = async (currentLocation = { lat, lng }, input) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/maps', token);
            const data = await authenticatedAxios.get('/autocomplete', {
                params:
                    { input, lat: currentLocation.lat, lng: currentLocation.lng }
            })
            return data['predictions'];
        } catch (error) {
            throw error;
        }
    }

    const goToPlace = async (currentLocation = { lat, lng }, destination) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/maps', token);
            const data = await authenticatedAxios.post('/go', { origin: { latitude: currentLocation.lat, longitude: currentLocation.lng }, destination })
            return data;
        } catch (error) {
        }
    }

    return { autoComplete, goToPlace }
}

export default useMapService