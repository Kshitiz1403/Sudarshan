import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'

const Loading = ({ title = "Loading..." }) => {
    const themeColors = useTheme().colors;

    return (
        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', backgroundColor: themeColors.background }}>
            <Text style={{ textAlign: 'center', color: themeColors.text }}>{title}</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({})