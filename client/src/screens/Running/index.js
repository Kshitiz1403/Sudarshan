import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { Feather, FontAwesome } from '@expo/vector-icons'
import colors from '../../theme/colors'

const Running = ({ navigation }) => {

    const dispatch = useDispatch();

    const lastSavedLocation = useSelector(state => state.location.lastSavedLocation);

    const latitude = useSelector(state => state.location.latitude)
    const longitude = useSelector(state => state.location.longitude)
    const isLocationLoaded = useSelector(state => state.location.isLocationLoaded);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <MapView style={{ flex: 1, }}
                    // initialRegion={{
                    //     latitude: lastSavedLocation.latitude,
                    //     longitude: lastSavedLocation.longitude
                    // }}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.0122,
                        longitudeDelta: 0.0122,
                    }}
                    camera={{ center: { latitude, longitude } }}
                >
                    {isLocationLoaded && <Marker coordinate={{ latitude, longitude }} image={require('../../assets/map_current.png')} />}
                </MapView>
                <View style={styles.topContainer}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.hamburgerContainer}>
                        <Feather name="menu" size={34} color="black" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <FontAwesome name='search' size={22} color={colors.secondary} style={{ marginHorizontal: 10 }} />
                        <TouchableOpacity style={{ padding: 12 }} onPress={() => navigation.navigate("Search")}><Text style={{ fontWeight: '500', color: colors.secondary }}>Where are you going to?</Text></TouchableOpacity>
                        {/* <TextInput placeholder='Where are you going to?' autoCapitalize='sentences' autoCorrect={false} style={styles.searchInput} /> */}
                    </View>
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