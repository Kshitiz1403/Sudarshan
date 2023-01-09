import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../theme/colors'
import { useTheme } from '@react-navigation/native'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useThemeService from '../../hooks/themeService';


const Settings = () => {
    const themeService = useThemeService();
    const theme = useSelector(state => state.theme.scheme)

    const themeColors = useTheme().colors;

    const handleThemeSelection = (value) => {
        if (value == 'default') {
            themeService.updateThemePreference({ system_default: true })
            return
        }
        if (value == 'dark') {
            themeService.updateThemePreference({ dark: true });
            return
        }
        if (value == 'light') {
            themeService.updateThemePreference({ light: true });
            return
        }
    }
    const Item = ({ children, label }) => (
        <View style={itemStyles.container}>
            <Text style={itemStyles.title}>{label}</Text>
            {children}
        </View>
    )

    const ThemeSelector = ({ text, value, isLeft, isRight }) => {
        const isSelected = value === theme;
        const RADIUS = 7.5;

        return <TouchableOpacity activeOpacity={0.6} onPress={() => handleThemeSelection(value)}
            style={{
                borderColor: colors.primary,
                borderWidth: 1.5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: isSelected ? colors.primary : 'none',
                borderTopRightRadius: isRight ? RADIUS : 0,
                borderBottomRightRadius: isRight ? RADIUS : 0,
                borderTopLeftRadius: isLeft ? RADIUS : 0,
                borderBottomLeftRadius: isLeft ? RADIUS : 0,
                borderRightWidth: isLeft ? 0 : 1.5,
                borderLeftWidth: isRight ? 0 : 1.5
            }}>
            <Text style={{ color: isSelected ? 'white' : colors.primary }}>{text}</Text>
        </TouchableOpacity>
    }
    const ThemeItem = () => (
        <Item label="Theme">
            <View style={{ flexDirection: 'row' }}>
                <ThemeSelector text="Light" value="light" isLeft />
                <ThemeSelector text="System Default" value="default" />
                <ThemeSelector text="Dark" isRight value="dark" />
            </View>
        </Item>
    )

    return (
        <View>
            <ThemeItem />
        </View>
    )
}

export default Settings

const itemStyles = StyleSheet.create({
    container: {
        height: 70, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, alignItems: 'center', marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: colors.secondary
    },
    title: { color: colors.secondary, fontSize: 16, fontWeight: '500' }
})

const styles = StyleSheet.create({})