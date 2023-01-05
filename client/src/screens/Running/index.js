import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import colors from '../../theme/colors'
import useMapService from '../../hooks/api/mapService'

const Running = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const lastSavedLocation = useSelector(state => state.location.lastSavedLocation);

    const latitude = useSelector(state => state.location.latitude)
    const longitude = useSelector(state => state.location.longitude)
    const isLocationLoaded = useSelector(state => state.location.isLocationLoaded);

    const mapService = useMapService();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <MapView style={{ flex: 1, }}
                    provider={PROVIDER_GOOGLE}
                    // initialRegion={{
                    //     latitude: lastSavedLocation.latitude,
                    //     longitude: lastSavedLocation.longitude
                    // }}
                    region={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0122,
                    }}
                >
                    <Marker coordinate={{ latitude, longitude }} image={require('../../assets/map_current.png')} />
                </MapView>
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.hamburgerContainer}>
                        <Feather name="menu" size={34} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{ ...styles.searchContainer, padding: 10 }} onPress={() => navigation.navigate("Search")}>
                        <FontAwesome name='search' size={22} color={colors.secondary} style={{ marginHorizontal: 10 }} />
                        <Text style={{ fontWeight: '500', color: colors.secondary }}>Where are you going to?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default Running

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 20,
        width: '100%'
    },
    hamburgerContainer: {
        width: '10%'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        width: '90%'
    },
    searchInput: {
        padding: 10,
        fontWeight: '600',
    }
})