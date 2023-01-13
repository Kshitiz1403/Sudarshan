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
import _debounce from 'lodash.debounce'
import { useEffect } from 'react';
import useTripService from '../../hooks/api/tripService';

const Report = ({ navigation, route }) => {
    const themeColors = useTheme().colors;
    const isDarkMode = useSelector(state => state.theme.isDark)
    const tripService = useTripService();

    const [slider, setSlider] = useState(1)

    const [selected, setSelected] = useState('calories')

    const [report, setReport] = useState({ reportId: "", calories: "jdaskl", time: "time", speed: "speed", trash: "trash" })


    const goToHome = async () => {
        await addFeedback();
        navigation.navigate("Running")
    }

    const addFeedback = async () => {
        const score = slider * 100;
        const reportResponse = await tripService.addFeedback(report.reportId, score)
        return reportResponse
    }

    useEffect(() => {
        let reportId = "";
        let calories = "";
        let distance = "";
        let speed = "";
        let time = "";
        let trash = "";

        if (route['params'] && route.params['reportData'] && route.params['reportData']['calories']) calories = route.params['reportData']['calories'];
        if (route['params'] && route.params['reportData'] && route.params['reportData']['distance(KM)']) distance = route.params['reportData']['distance(KM)'];
        if (route['params'] && route.params['reportData'] && route.params['reportData']['speed(KMH)']) speed = route.params['reportData']['speed(KMH)'];
        if (route['params'] && route.params['reportData'] && route.params['reportData']['time(S)']) time = route.params['reportData']['time(S)'];
        if (route['params'] && route.params['reportData'] && route.params['reportData']['trash(KG)']) trash = route.params['reportData']['trash(KG)'];
        if (route['params'] && route.params['reportData'] && route.params['reportData']['_id']) reportId = route.params['reportData']['_id'];
        setReport({ reportId, calories, time, speed, trash, distance })
    }, [route])

    const handleMainTexts = () => {
        function fancyTimeFormat(duration) {
            // Hours, minutes and seconds
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var ret = "";
            let isHours = false;
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                isHours = true;
            }

            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return { result: ret, isHours };
        }

        let main = Math.round((report[selected]) * 100) / 100;
        let subMain;
        if (selected == 'time') {
            const { result, isHours } = fancyTimeFormat(main);
            main = result;
            if (isHours) subMain = "hours"
            else subMain = "minutes"
        } else if (selected == 'speed') {
            subMain = "km/hr"
        }
        else if (selected == 'calories') {
            subMain = "calories"
        } else if (selected == "trash") {
            subMain = "kg"
        }
        return { main, subMain }
    }

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
                        onValueChange={_debounce((v) => setSlider(v), 50)}
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
                    <ThemedText style={bottomStyles.detailsMain}>{handleMainTexts().main}</ThemedText>
                    <ThemedText style={bottomStyles.detailsSub}>{handleMainTexts().subMain}</ThemedText>
                </View>
                <TouchableOpacity style={{ ...sharedStyles.button, width: '75%' }} activeOpacity={0.7} onPress={goToHome}>
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