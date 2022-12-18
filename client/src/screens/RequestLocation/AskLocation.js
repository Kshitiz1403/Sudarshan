import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../theme/colors'
import useLocationService from '../../hooks/locationService'

const AskLocation = () => {
    /**
     * Requests for location from user when user is onboarding
     */
    const locationService = useLocationService();

    const askLocationPermission = () => {
        locationService.askForLocationPermission()
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.subtitle}>Last thing and we are done</Text>
                <Text style={styles.title}>We need access to Location</Text>
                <Text style={styles.description}>Your location helps our system to map down dustbin drop locations.</Text>
            </View>
            <View style={styles.midContainer}>
                <Image source={require("../../assets/map_marker.png")} style={{ resizeMode: "contain", width: '15%' }} />
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={askLocationPermission}>
                    <Text style={styles.buttonText}>Grant access to Location</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AskLocation

const styles = StyleSheet.create({
    container: { flex: 1 },
    topContainer: { flex: 0.4, padding: 30 },
    subtitle: { letterSpacing: 1, color: colors.secondary, width: "100%", flexWrap: 'wrap', flexDirection: 'row', textTransform: "uppercase", marginBottom: 20 },
    title: { fontSize: 26, fontWeight: "bold", width: "100%", flexWrap: 'wrap', flexDirection: 'row', marginBottom: 20, fontFamily: "monospace" },
    description: { fontSize: 16, fontWeight: "400", letterSpacing: 1, lineHeight: 20, color: colors.secondary },
    midContainer: { flex: 0.4, alignItems: 'center' },
    bottomContainer: { flex: 0.2, alignItems: 'center' },
    button: { backgroundColor: colors.primary, borderRadius: 10, width: '75%', height: 50, justifyContent: 'center' },
    buttonText: { textAlign: 'center', width: '100%', fontWeight: '600', color: 'white', fontSize: 18 }
})