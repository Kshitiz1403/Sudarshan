import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../theme/colors'
import { useTheme } from '@react-navigation/native'

const ListContainer = ({ isFocused, distance = '1.1km', duration = '44 minutes' }) => {
    const themeColors = useTheme().colors;

    return (
        <View style={{ height: 50, minWidth: 150, borderColor: isFocused ? colors.primary : colors.secondary, borderRadius: 7.5, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, marginRight: 5 }}>
            <Text style={{ color: isFocused ? themeColors.primary : themeColors.text, }}>{distance}</Text>
            <Text style={{ color: isFocused ? themeColors.primary : themeColors.text, marginLeft: 10, }}>{duration}</Text>
        </View>
    )
}

export default ListContainer

const styles = StyleSheet.create({})