import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../theme/colors'

const ListContainer = ({ isFocused, distance = '1.1km', duration = '44 minutes' }) => {
    return (
        <View style={{ height: 50, minWidth: 150, borderColor: isFocused ? colors.primary : colors.secondary, borderRadius: 7.5, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5, marginRight: 5 }}>
            <Text style={{ color: isFocused ? colors.primary : 'black', }}>{distance}</Text>
            <Text style={{ color: isFocused ? colors.primary : 'black', marginLeft: 10, }}>{duration}</Text>
        </View>
    )
}

export default ListContainer

const styles = StyleSheet.create({})