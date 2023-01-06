import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme/colors'
import { useTheme } from '@react-navigation/native'
import useThemeService from '../../hooks/themeService'
import { useRef } from 'react'

const Running = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const latitude = useSelector(state => state.location.latitude)
    const longitude = useSelector(state => state.location.longitude)
    const isDarkMode = useSelector(state => state.theme.isDark)

    const themeService = useThemeService();

    const themeColors = useTheme().colors;

    const mapViewRef = useRef(null)

    const resetCameraToMyPosition = () => {
        mapViewRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <MapView style={{ flex: 1, }}
                    ref={mapViewRef}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0122,
                    }}
                    customMapStyle={themeService.themeForMap()}
                >
                    <Marker coordinate={{ latitude, longitude }} image={require('../../assets/map_current.png')} />
                </MapView>
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.hamburgerContainer}>
                        <Feather name="menu" size={34} color={themeColors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{ ...styles.searchContainer, padding: 10, backgroundColor: isDarkMode ? '#e2e2e2e8' : '#323232e8' }} onPress={() => navigation.navigate("Search")}>
                        <FontAwesome name='search' size={22} color={colors.secondary} style={{ marginHorizontal: 10 }} />
                        <Text style={{ fontWeight: '500', color: colors.secondary }}>Where are you going to?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={resetCameraToMyPosition} style={{ position: 'absolute', backgroundColor: themeColors.card, borderRadius: 50, height: 50, width: 50, bottom: 20, right: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name='my-location' color={themeColors.text} size={24} />
                </TouchableOpacity>
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