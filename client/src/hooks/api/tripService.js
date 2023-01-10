import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux"
import { endTripAction, startTripAction } from "../../store/reducers/tripSlice";
import { getAuthenticatedAxios } from "./baseConfig";

const useTripService = () => {
    const token = useSelector(state => state.auth.token);
    const selectedDustbin = useSelector(state => state.dustbin.selectedDustbin);
    const destinationLocation = useSelector(state => state.location.destinationLocation)
    const sourceLocation = {
        latitude: useSelector(state => state.location.latitude),
        longitude: useSelector(state => state.location.longitude)
    }
    const tripId = useSelector(state => state.trip.tripId);

    const dispatch = useDispatch();

    const startTrip = async (navigation) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/trips', token);
            const data = await authenticatedAxios.post('/start', {
                dustbinId: selectedDustbin['_id'],
                destinationLocation,
                sourceLocation,
                distance: selectedDustbin.distance.value
            })
            dispatch(startTripAction({ selectedDustbin, selectedLocation: destinationLocation, id: data['_id'] }))
            await navigate();
            navigation.navigate("OngoingTrip");
            return data;
        } catch (e) {

        }
    }

    const endTrip = async (navigation) => {
        try {
            const authenticatedAxios = getAuthenticatedAxios('/trips', token);
            const data = await authenticatedAxios.post('/end', {
                tripId
            })
            dispatch(endTripAction());
            navigation.navigate("Running")
        } catch (e) {

        }
    }

    const checkIfReached = () => {
        const dustbin_location = { latitude: selectedDustbin.dustbin_location.lat, longitude: selectedDustbin.dustbin_location.lng };
        if (distanceBetweenTwoCoordinates(dustbin_location, sourceLocation) <= 50) { //we are standing 50 meters apart from the dustbin
            return true;
        }
        return false;
    }


    function distanceBetweenTwoCoordinates(cord1, cord2) {
        if (cord1.latitude == cord2.latitude && cord1.lon == cord2.lon) {
            return 0;
        }

        const radlat1 = (Math.PI * cord1.latitude) / 180;
        const radlat2 = (Math.PI * cord2.latitude) / 180;

        const theta = cord1.lon - cord2.lon;
        const radtheta = (Math.PI * theta) / 180;

        let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (dist > 1) {
            dist = 1;
        }

        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344; //convert miles to km
        dist = dist * 1000; //convert km to meters

        return dist;
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
        return Linking.canOpenURL(url).then(supported => {
            if (supported) return Linking.openURL(url)
        })
    }

    return { startTrip, endTrip, checkIfReached }
}

export default useTripService;