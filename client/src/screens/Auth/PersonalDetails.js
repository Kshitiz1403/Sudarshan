import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../theme/colors'
import DatePicker from 'react-native-date-picker'
import sharedStyles from './sharedStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileCompleted } from '../../store/reducers/authSlice';
import useAuthService from '../../hooks/api/authService';
import { useTheme } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

const PersonalDetails = ({ navigation, route }) => {

    const user = useSelector(state => state.auth.user);

    const [isCalledFromProfile, setIsCalledFromProfile] = useState(false)

    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [dobRaw, setDOBRaw] = useState(new Date())
    const [dob, setDOB] = useState('')
    const [height, setHeight] = useState("")
    const [weight, setWeight] = useState("")
    const [gender, setGender] = useState("")

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [imageData, setImageData] = useState({ URI: "", filename: "", type: "" })

    useEffect(() => {
        if (user['name']) setName(user.name);
        if (user['dob']) {
            let date = new Date(user.dob);
            setDOBRaw(date);
            setDOB(date.toLocaleDateString())
        }
        if (user['gender']) setGender(user.gender)
        if (user['heightCM']) setHeight(`${user.heightCM}`)
        if (user['weightKG']) setWeight(`${user.weightKG}`);
    }, [user])

    useEffect(() => {
        if (route.params && route.params['isCalledFromProfile'] == true) {
            setIsCalledFromProfile(true)
        }
    }, [route])

    const authService = useAuthService();
    const dispatch = useDispatch();

    const updateDate = (date) => {
        setDOBRaw(date)
        let d = new Date(date);
        setDOB(d.toLocaleDateString())
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



    const submit = async () => {
        await authService.completeProfile(name, dobRaw, gender, weight, height, imageData)
        if (isCalledFromProfile) navigation.goBack();
    }

    const skip = () => {
        dispatch(setProfileCompleted())
    }

    const pickImage = async (result) => {
        if (result.didCancel) return;

        let imageURI = result.assets[0].uri;
        let type = result.assets[0].type;
        setImage(imageURI);
        const fileName = imageURI.split('/').pop();
        setImageData({ URI: imageURI, filename: fileName, type })
    }

    const pickFromGallery = async () => {
        const result = await launchImageLibrary({ mediaType: "photo", quality: 1, selectionLimit: 1, })
        pickImage(result)
    }

    const pickFromCamera = async () => {
        const result = await launchCamera({ mediaType: "photo", quality: 1, });
        pickImage(result)
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

    const themeColors = useTheme().colors;

    const Label = ({ label }) => <Text style={{ ...styles.itemTitle, color: themeColors.text }}>{label}</Text>

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* {!isCalledFromProfile && <TouchableOpacity style={styles.skipContainer} onPress={skip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>} */}
            <View style={styles.titleContainer}>
                <Text style={{ ...styles.title, color: themeColors.text }}>Personal Details</Text>
                <Text style={styles.subText}>Let us know about you to speed up the result, get fit with your personal workout plan.</Text>
            </View>
            <View style={styles.itemsWrapper}>
                <View style={styles.itemContainer}>
                    <Label label="Name" />
                    <TextInput placeholder='Enter name' placeholderTextColor={colors.primary} style={styles.itemValue} value={name} onChangeText={(t) => setName(t)} />
                </View>
                <View style={styles.itemContainer}>
                    <Label label='Profile Pic (optional)' />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {(image || user['profileImage']) && <Image source={{ uri: (image || user['profileImage']) }} style={{ width: 50, aspectRatio: 1, marginRight: 10 }} />}
                        <TouchableOpacity onPress={pickFromGallery} style={{ marginRight: 10 }}>
                            <MaterialIcons name="photo-library" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickFromCamera}>
                            <Feather name="camera" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ ...styles.itemContainer, paddingVertical: 10 }}>
                    <Label label="Birthday" />
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(prev => !prev)}>
                        <Text style={styles.itemValue}>{dob ? dob : 'Select date'}</Text>
                    </TouchableOpacity>
                </View>
                <DatePicker modal open={isDatePickerVisible} date={dobRaw} onConfirm={updateDate} onCancel={() => setIsDatePickerVisible(false)} mode="date" textColor={colors.primary} />
                <View style={styles.itemContainer}>
                    <Label label="Height" />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder={height ? "  " : 'Enter height (cm)'} placeholderTextColor={colors.primary} style={styles.itemValue} value={height} onChangeText={updateHeight} keyboardType='numeric' />
                        <Text style={styles.itemValue}>{height ? " cm" : ""}</Text>
                    </View>
                </View>
                <View style={styles.itemContainer}>
                    <Label label="Weight" />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder={weight ? "  " : 'Enter weight (kg)'} placeholderTextColor={colors.primary} style={styles.itemValue} value={weight} onChangeText={updateWeight} keyboardType='numeric' />
                        <Text style={styles.itemValue}>{weight ? " kg" : ""}</Text>
                    </View>
                </View>
                <View style={{ ...styles.itemContainer, paddingBottom: 10 }}>
                    <Label label="Gender" />
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
    itemTitle: { fontSize: 18, fontWeight: '600', flex: 1, alignSelf: 'center' },
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