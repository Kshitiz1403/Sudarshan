import { BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../theme/colors'
import DatePicker from 'react-native-modern-datepicker';
import sharedStyles from './sharedStyles';
import { useDispatch } from 'react-redux';
import { setProfileCompleted } from '../../store/reducers/authSlice';
import useAuthService from '../../hooks/api/authService';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';

const PersonalDetails = () => {

    const [name, setName] = useState('Kshitizdemo')
    const [dobRaw, setDOBRaw] = useState(new Date())
    const [dob, setDOB] = useState('')
    const [height, setHeight] = useState('36')
    const [weight, setWeight] = useState('24')
    const [gender, setGender] = useState('Male')

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

    const authService = useAuthService();
    const dispatch = useDispatch();

    const updateDate = (date) => {
        let rawDate = new Date(date);
        setDOBRaw(rawDate)
        let d = new Date(date).toDateString();
        d = d.split(' ').slice(1)
        d = `${d[0]} ${d[1]}, ${d[2]}`
        setDOB(d)
        setIsDatePickerVisible(false)
    }

    const updateHeight = (t) => {
        // Handles only numeric values with decimals and no leading zeroes
        setHeight(t.replace(/[^0-9.]/g, '').replace(/^0[^.]/, '0'))
    }

    const updateWeight = (t) => {
        // Handles only numeric values with decimals and no leading zeroes
        setWeight(t.replace(/[^0-9.]/g, '').replace(/^0[^.]/, '0'))
    }

   

    const submit = () => {
        authService.completeProfile(name, dobRaw, gender, weight, height)
    }

    const skip = () => {
        dispatch(setProfileCompleted())
    }

    const GenderBox = ({ text, isLeft, isRight }) => {
        const isSelected = text === gender;
        return <TouchableOpacity activeOpacity={0.6} onPress={() => setGender(text)}
            style={{
                ...genderBoxStyles.container,
                backgroundColor: isSelected ? colors.primary : 'none',
                borderTopRightRadius: isRight ? 3 : 0,
                borderBottomRightRadius: isRight ? 3 : 0,
                borderTopLeftRadius: isLeft ? 3 : 0,
                borderBottomLeftRadius: isLeft ? 3 : 0,
                borderRightWidth: isLeft ? 0 : 1.5,
                borderLeftWidth: isRight ? 0 : 1.5
            }}>
            <Text style={{ color: isSelected ? 'white' : colors.primary }}>{text}</Text>
        </TouchableOpacity>
    }

    BackHandler.addEventListener("hardwareBackPress", () => {
        if (isDatePickerVisible) {
            setIsDatePickerVisible(false)
            return true;
        }
        return false;
    })

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity style={styles.skipContainer} onPress={skip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Personal Details</Text>
                <Text style={styles.subText}>Let us know about you to speed up the result, get fit with your personal workout plan.</Text>
            </View>
            <View style={styles.itemsWrapper}>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>Name</Text>
                    <TextInput placeholder='Enter name' placeholderTextColor={colors.primary} style={styles.itemValue} value={name} onChangeText={(t) => setName(t)} />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>Birthday</Text>
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(prev => !prev)} >
                        <Text style={styles.itemValue}>{dob ? dob : 'Select date'}</Text>
                    </TouchableOpacity>
                </View>
                {isDatePickerVisible && <DatePicker mode='calendar' onSelectedChange={updateDate} options={{ mainColor: colors.primary }} />}
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>Height</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder={height ? "  " : 'Enter height (cm)'} placeholderTextColor={colors.primary} style={styles.itemValue} value={height} onChangeText={updateHeight} keyboardType='numeric' />
                        <Text style={styles.itemValue}>{height ? " cm" : ""}</Text>
                    </View>
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>Weight</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder={weight ? "  " : 'Enter weight (kg)'} placeholderTextColor={colors.primary} style={styles.itemValue} value={weight} onChangeText={updateWeight} keyboardType='numeric' />
                        <Text style={styles.itemValue}>{weight ? " kg" : ""}</Text>
                    </View>
                </View>
                <View style={{ ...styles.itemContainer, paddingBottom: 10 }}>
                    <Text style={styles.itemTitle}>Gender</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%', }}>
                        <GenderBox text="Male" isLeft={true} />
                        <GenderBox text="Female" />
                        <GenderBox text="Other" isRight={true} />
                    </View>
                </View>
            </View>

            <TouchableOpacity activeOpacity={0.6} style={{ ...sharedStyles.button, width: '80%' }} onPress={submit}>
                <Text style={sharedStyles.buttonText}>
                    Submit
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default PersonalDetails

const styles = StyleSheet.create({
    skipContainer: { marginRight: 20, },
    skipText: { color: colors.primary, width: '100%', fontWeight: '600', textAlign: 'right' },
    titleContainer: { alignItems: 'center', margin: 30, marginTop: 20 },
    title: { fontWeight: 'bold', width: '100%', fontSize: 20, textAlign: 'center', marginBottom: 20 },
    subText: { textAlign: 'center', color: colors.secondary },
    itemsWrapper: { marginTop: 20, marginHorizontal: 20 },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: colors.tertiary, marginBottom: 50 },
    itemTitle: { fontSize: 18, fontWeight: '600', flex: 1 },
    itemValue: { color: colors.primary, fontSize: 16, }
})

const genderBoxStyles = StyleSheet.create({
    container: {
        borderColor: colors.primary,
        borderWidth: 1.5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
})