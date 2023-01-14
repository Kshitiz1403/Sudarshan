import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { useTheme } from '@react-navigation/native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import colors from '../../theme/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import ThemedText from '../../components/ThemedText';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import sharedStyles from '../Auth/sharedStyles'
import useTripService from '../../hooks/api/tripService';
import { useEffect } from 'react';
import { useState } from 'react';

const Item = ({ date, distance, calories, distanceDelta, caloriesDelta, onPress = () => { } }) => {
    const themeColors = useTheme().colors;
    const isDistanceIncreased = distanceDelta >= 0;
    const isCaloriesIncreased = caloriesDelta >= 0;


    return <View style={{ ...listItemStyles.container, backgroundColor: themeColors.background, }}>
        <View style={listItemStyles.leftContainer}>
            <Text style={listItemStyles.date}>{date}</Text>
            <View>
                <View style={listItemStyles.statContainer}>
                    <ThemedText>{distance}</ThemedText>
                    <ThemedText style={{ color: isDistanceIncreased ? 'green' : 'red' }}><SimpleLineIcons name={isDistanceIncreased ? 'arrow-up' : 'arrow-down'} size={14} color={isDistanceIncreased ? 'green' : 'red'} /> {Math.round(Math.abs(distanceDelta) * 100 * 100) / 100} %</ThemedText>
                </View>
                <View style={listItemStyles.statContainer}>
                    <ThemedText>{calories}</ThemedText>
                    <ThemedText style={{ color: isCaloriesIncreased ? 'green' : 'red' }}><SimpleLineIcons name={isCaloriesIncreased ? 'arrow-up' : 'arrow-down'} size={14} color={isCaloriesIncreased ? 'green' : 'red'} /> {Math.round(Math.abs(caloriesDelta) * 100 * 100) / 100} %</ThemedText>
                </View>
            </View>
        </View>
    </View>
}

const HomeBottomSheet = ({ bottomSheetRef, navigation }) => {
    const snapPoints = useMemo(() => ['2.5%', '35%'], [])

    const themeColors = useTheme().colors;
    const tripService = useTripService();

    const [reports, setReports] = useState([])
    const getPreviousWalks = async () => {
        const reports = await tripService.getPreviousWalks();
        let count = 0;
        reports.map(report => report['id'] = count++)
        return reports;
    }
    useEffect(() => {
        (async () => {
            const reports = await getPreviousWalks()
            setReports(reports)
        })();
    }, [])


    return (
        <View style={{ height: '100%' }}>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} backgroundStyle={{ backgroundColor: themeColors.card }} handleIndicatorStyle={{ backgroundColor: colors.primary }} >
                <View style={{ paddingHorizontal: 20, flex: 1 }}>
                    <View style={{ marginBottom: 10 }}>
                        <ThemedText style={{ textTransform: "uppercase", fontWeight: '600', width: '100%' }}>Your previous walks</ThemedText>
                    </View>
                    <BottomSheetScrollView>
                        {reports && reports.length > 0 ?
                            <>
                                {reports.map(report => <Item key={report['id']} date={report['date']} calories={report['calories']} distance={report['distance']} distanceDelta={report['changeInDistance']} caloriesDelta={report['changeInCalories']} />)}
                            </>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <ThemedText>You don't have any previous walks, let's start a walk?</ThemedText>
                                <TouchableOpacity style={{ ...sharedStyles.button, width: '50%' }} onPress={() => navigation.navigate("Search")}>
                                    <Text style={sharedStyles.buttonText}>Start</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </BottomSheetScrollView>


                </View>
            </BottomSheet>
        </View>
    )
}

export default HomeBottomSheet

const listItemStyles = StyleSheet.create({
    container: {
        height: 100,
        borderRadius: 15,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    leftContainer: {
        flex: 0.7,
        justifyContent: 'space-evenly'
    },
    date: {
        color: colors.primary,
        fontWeight: '500'
    },
    rightContainer: {
        flex: 0.1
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

const styles = StyleSheet.create({

})