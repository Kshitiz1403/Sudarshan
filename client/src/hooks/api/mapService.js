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
    return { autoComplete }
}

export default useMapService