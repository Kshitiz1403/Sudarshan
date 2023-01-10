import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ThemedText from '../../components/ThemedText'
import sharedStyles from '../Auth/sharedStyles'
import useTripService from '../../hooks/api/tripService'

const OngoingTrip = ({ navigation }) => {
    const tripService = useTripService();

    const scan = () => {
        navigation.navigate("QR")
    }
    const endTrip = async () => {
        await tripService.endTrip();
        navigation.navigate("Running")
    }
    return (
        <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <ThemedText>Reached Already?</ThemedText>
                <TouchableOpacity style={sharedStyles.button} onPress={scan}>
                    <ThemedText style={{ ...sharedStyles.buttonText, fontWeight: 'normal', fontSize: 16 }}>Scan QR Code</ThemedText>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, justifyContent: 'center', borderRadius: 20, paddingHorizontal: 20 }} onPress={endTrip}>
                <Text style={{ color: 'white', fontSize: 16 }}>End Trip</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OngoingTrip

const styles = StyleSheet.create({})