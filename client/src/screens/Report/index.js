import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native'
import Slider from '@react-native-community/slider';
import { useSelector } from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme/colors';
import ThemedText from '../../components/ThemedText';
import sharedStyles from '../Auth/sharedStyles';

const Report = () => {
    const themeColors = useTheme().colors;
    const isDarkMode = useSelector(state => state.theme.isDark)

    const [slider, setSlider] = useState(1)

    const [selected, setSelected] = useState('calories')

    return (
        <View style={{ flex: 1 }}>
            <View style={topStyles.wrapper}>
                <View style={topStyles.container}>
                    <Text style={topStyles.title}>How about the run?</Text>
                    <View style={topStyles.sliderTextContainer}>
                        <Text style={{ color: 'white' }}>Too easy</Text>
                        <Text style={{ color: 'white' }}>I'm exhausted</Text>
                    </View>
                    <Slider
                        value={slider}
                        onValueChange={v => setSlider(v)}
                        style={{ width: '80%', height: 50 }}
                        minimumValue={0}
                        maximumValue={1}
                        thumbTintColor='white'
                        minimumTrackTintColor='white'
                        maximumTrackTintColor='#ffffffd3'
                    />
                </View>
            </View>
            <View style={{ ...bottomStyles.wrapper, backgroundColor: themeColors.background }}>
                <View style={bottomStyles.iconsWrapper}>
                    <TouchableOpacity activeOpacity={0.7} style={bottomStyles.icon} onPress={() => setSelected('speed')}>
                        <MaterialIcons name='speed' size={24} color={selected == 'speed' ? themeColors.text : colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={bottomStyles.icon} onPress={() => setSelected('calories')}>
                        <SimpleLineIcons name='fire' size={24} color={selected == 'calories' ? themeColors.text : colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={bottomStyles.icon} onPress={() => setSelected('time')}>
                        <SimpleLineIcons name='clock' size={24} color={selected == 'time' ? themeColors.text : colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={bottomStyles.icon} onPress={() => setSelected('trash')}>
                        <Octicons name='trash' size={24} color={selected == 'trash' ? themeColors.text : colors.secondary} />
                    </TouchableOpacity>
                </View>
                <ThemedText style={bottomStyles.title}>
                    Calories
                </ThemedText>
                <View style={bottomStyles.detailsContainer}>
                    <ThemedText style={bottomStyles.detailsMain}>42:09</ThemedText>
                    <ThemedText style={bottomStyles.detailsSub}>minutes</ThemedText>
                </View>
                <TouchableOpacity style={{ ...sharedStyles.button, width: '75%' }} activeOpacity={0.7}>
                    <ThemedText style={{ ...sharedStyles.buttonText }}>Done</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Report

const topStyles = StyleSheet.create({
    wrapper: {
        flex: 0.35, backgroundColor: colors.primary, width: '100%'
    },
    container: {
        height: 200, alignItems: 'center', justifyContent: 'center',
    },
    title: { color: 'white', width: '100%', textAlign: 'center', fontWeight: '600', fontSize: 15 },
    sliderTextContainer: { flexDirection: 'row', width: '75%', justifyContent: 'space-between', marginTop: 20 }
})

const bottomStyles = StyleSheet.create({
    wrapper: {
        flex: 0.65,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        top: -75,
    },
    iconsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        width: '100%',
        fontWeight: '600',
        fontSize: 16
    },
    detailsContainer: {
        width: '100%', alignItems: 'center'
    },
    detailsMain: {
        fontWeight: '600', fontSize: 28, width: '100%', textAlign: 'center', marginBottom: 10
    },
    detailsSub: {
        fontWeight: '600', fontSize: 18, width: '100%', textAlign: 'center'
    }
})