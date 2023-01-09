import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const ClosedBox = ({ onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginBottom: 10 }}>
            <Image source={require("../../assets/gift_closed.png")} style={{ height: 150, width: '100%' }} resizeMode="contain" />
        </TouchableOpacity>
    )
}

export default ClosedBox

const styles = StyleSheet.create({})