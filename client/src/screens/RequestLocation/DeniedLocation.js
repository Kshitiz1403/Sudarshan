import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const DeniedLocation = () => {
    /**
     * @todo
     * Requests for location when user has manually disabled location (from Phone settings) after allowing it from Onboarding location screen
     * It runs on app load
     */
    return (
        <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text>Please allow access to location from settings</Text>
        </SafeAreaView>
    )
}

export default DeniedLocation

const styles = StyleSheet.create({})