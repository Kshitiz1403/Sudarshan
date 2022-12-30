import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../theme/colors'

const Navigate = ({ navigation }) => {

    const [timer, setTimer] = useState(5)

    useEffect(() => {
        if (timer == 0) {
            navigation.navigate("QR");
            return
        }
    }, [timer])

    useEffect(() => {
        setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
    }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
            <Text style={{ color: 'white', textAlign: 'center', width: '100%', fontSize: 16 }}>Navigating to scan the QR code screen in {timer}</Text>
        </View>
    )
}

export default Navigate

const styles = StyleSheet.create({})