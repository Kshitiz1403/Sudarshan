import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const OpenBox = ({ label }) => {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'red', textAlign: 'center', position: 'absolute', top: 62.5, width: '100%', fontWeight: '600' }}>{label}</Text>
            <Image source={require("../../assets/gift_open.png")} style={{ height: 150, width: '100%' }} resizeMode="contain" />
        </View>
    )
}

export default OpenBox

const styles = StyleSheet.create({})