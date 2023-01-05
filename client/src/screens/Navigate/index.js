import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../theme/colors'

const Navigate = ({ navigation }) => {

    const [timer, setTimer] = useState(5)
    const [intervalId, setIntervalId] = useState(null)

    useEffect(() => {
        if (timer == 0) {
            navigation.navigate("QR");
            clearInterval(intervalId)
            return
        }
    }, [timer])

    useEffect(() => {
        const id = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        setIntervalId(id)
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
            <Text style={{ color: 'white', textAlign: 'center', width: '100%', fontSize: 16 }}>Navigating to scan the QR code screen in {timer}</Text>
        </View>
    )
}

export default Navigate

const styles = StyleSheet.create({})