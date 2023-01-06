import { useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig"
import { Linking } from "react-native"

const useMapService = () => {
    const token = useSelector(state => state.auth.token)
    const selectedDustbin = useSelector(state => state.dustbin.selectedDustbin)

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

    const navigate = () => {
        const params = [
            {
                key: "travelmode",
                value: "walking"        // may be "walking", "bicycling" or "transit" as well
            },
            {
                key: "dir_action",
                value: "navigate"       // this instantly initializes navigation using the given travel mode
            },
            {
                key: "destination",
                value: `${selectedDustbin.dustbin_location.lat},${selectedDustbin.dustbin_location.lng}`
            }
        ]

        const getParams = (params = []) => {
            return params.map(({ key, value }) => {
                const encodedKey = encodeURIComponent(key)
                const encodedValue = encodeURIComponent(value)
                return `${encodedKey}=${encodedValue}`
            })
                .join('&')
        }
        const url = `https://www.google.com/maps/dir/?api=1&${getParams(params)}`
        Linking.canOpenURL(url).then(supported => {
            if (supported) Linking.openURL(url)
        })
    }

    return { autoComplete, goToPlace, navigate }
}

export default useMapService