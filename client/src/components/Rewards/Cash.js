import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Cash = () => {
    return (
        <View style={{ marginBottom: 10 }}>
            <Image source={require("../../assets/cash.png")} style={{ height: 150, width: '100%' }} resizeMode="contain" />
        </View>
    )
}

export default Cash

const styles = StyleSheet.create({})