import { Linking } from "react-native";
import { useSelector } from "react-redux"
import { getAuthenticatedAxios } from "./baseConfig";

const useTripService = () => {
    const token = useSelector(state => state.auth.token);
    const selectedDustbin = useSelector(state => state.dustbin.selectedDustbin);
    const destinationLocation = useSelector(state => state.location.destinationLocation)
    const sourceLocation = {
        latitude: useSelector(state => state.location.latitude),
        longitude: useSelector(state => state.location.longitude)
    }

    const startTrip = async () => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/trips', token);
            const data = await authenticatedAxios.post('/start', {
                dustbinId: selectedDustbin['_id'],
                destinationLocation,
                sourceLocation,
                distance: selectedDustbin.distance.value
            })
            navigate();
            return data;
        } catch (e) {

        }
    }

    const checkIfReached = () => {

    }

    function navigate() {
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

    return { startTrip }
}

export default useTripService;