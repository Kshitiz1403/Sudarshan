import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import colors from '../../theme/colors'
import useMapService from '../../hooks/api/mapService'
import Ionicons from 'react-native-vector-icons/Ionicons'
import BottomSheetComponent from '../../components/BottomSheet'
import { resetDustbin, selectDustbin, setDustbins } from '../../store/reducers/dustbinSlice'
import useThemeService from '../../hooks/themeService'

const Directions = ({ navigation, route }) => {

    const latitude = useSelector(state => state.location.latitude)
    const longitude = useSelector(state => state.location.longitude)
    const isLocationLoaded = useSelector(state => state.location.isLocationLoaded);

    const mapService = useMapService();
    const themeService = useThemeService();

    const dispatch = useDispatch();

    const [isFirstTimeLoaded, setIsFirstTimeLoaded] = useState(true)
    const [placeDetails, setPlaceDetails] = useState({ place_name: "", place_address: "" })
    const [points, setPoints] = useState([])
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

    const dustbins = useSelector(state => state.dustbin.dustbins);
    const selectedDustbin = useSelector(state => state.dustbin.selectedDustbin);
    const selectedIndex = useSelector(state => state.dustbin.selectedIndex);

    const mapViewRef = useRef(null)

    const configureRoute = async (place_id) => {
        const data = await mapService.goToPlace({ lat: latitude, lng: longitude }, { "place_id": place_id })
        setPoints(data['polyline']['path'])
        setDistance(data['distance']['text'])
        setDuration(data['duration']['text'])
        dispatch(setDustbins(data['dustbins']))
        setIsFirstTimeLoaded(false)
    }

    useEffect(() => {
        if (selectedIndex != -1) {
            setPoints(selectedDustbin['polyline']['path'])
        }
    }, [selectedIndex])


    useEffect(() => {
        setIsFirstTimeLoaded(true)
        dispatch(resetDustbin()) // resets the selected dustbin
        if (route['params'] && route.params['place_id']) {
            configureRoute(route.params['place_id'])
        }
        if (route['params'] && route.params['main_text']) {
            setPlaceDetails(prev => ({ ...prev, place_name: route.params.main_text }))
        }
        if (route['params'] && route.params['secondary_text']) {
            setPlaceDetails(prev => ({ ...prev, place_address: route.params.secondary_text }))
        }
    }, [route.params])

    useEffect(() => {
        if (!isFirstTimeLoaded) return
        if (mapViewRef.current && points && points.length > 0) {
            const destinationPoint = points[points.length - 1];
            mapViewRef.current.animateCamera({ zoom: 16.12560272216797, center: { longitude: destinationPoint.longitude, latitude: destinationPoint.latitude } }, { duration: 2000 })
            setTimeout(() => {
                mapViewRef.current.animateCamera({ zoom: 16.12560272216797, center: { longitude, latitude } }, { duration: 2000 })
            }, 2500);
        }
    }, [points])


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <MapView style={{ flex: 1, }}
                    provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0122,
                    }}
                    ref={mapViewRef}
                    customMapStyle={themeService.themeForMap()}
                >
                    {isLocationLoaded && <Marker coordinate={{ latitude, longitude }} image={require('../../assets/map_current.png')} />}
                    {points && points.length > 0 && <Marker coordinate={{ latitude: (points[points.length - 1]).latitude, longitude: (points[points.length - 1]).longitude }} image={require('../../assets/map_destination.png')} />
                    }
                    {dustbins && dustbins.length > 0 && selectedIndex != -1 && <Marker coordinate={{ latitude: selectedDustbin['dustbin_location']['lat'], longitude: selectedDustbin['dustbin_location']['lng'] }} image={require('../../assets/litter.png')} />}
                    <Polyline coordinates={points} strokeWidth={5} strokeColor={colors.primary} lineDashPattern={[1, 15]} />
                </MapView>
                <View style={{ position: 'absolute', bottom: 0, height: '100%', width: '100%' }}>
                    <BottomSheetComponent place_name={placeDetails.place_name} place_address={placeDetails.place_address} distance={distance} duration={duration} navigation={navigation} />
                </View>
                <TouchableOpacity style={{ position: 'absolute', top: 50, left: 10 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Directions

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})