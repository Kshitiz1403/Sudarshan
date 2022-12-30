import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import colors from '../../theme/colors'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import { CameraType } from 'expo-camera/build/Camera.types'
import useDustbinService from '../../hooks/api/dustbinService'

const QRScreen = ({ navigation }) => {

    const dustbinService = useDustbinService();

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    // const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        // const getBarCodeScannerPermissions = async () => {
        //     const { status } = await BarCodeScanner.requestPermissionsAsync();
        //     setHasPermission(status === 'granted');
        // };

        // getBarCodeScannerPermissions();

        requestPermission();
    }, []);
    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
    const handleBarCodeScanned =async ({ type, data }) => {
        if (scanned) return
        setScanned(true);
        const response = await dustbinService.scan(data);
        navigation.navigate("Running")
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 30, backgroundColor: colors.primary }}></View>
            <View style={{ height: 75, backgroundColor: colors.primary, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center', width: '100%', fontSize: 18 }}>Scan QR Code</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Camera type={type} style={{ width: '100%', aspectRatio: 1 }} ratio={'1:1'} onBarCodeScanned={handleBarCodeScanned} />
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity onPress={toggleCameraType}>
                        <Text>Flip Camera</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity >
                        <Text>Click</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text>Click</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
            <TouchableOpacity style={{ position: 'absolute', top: 50, left: 10 }} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default QRScreen

const styles = StyleSheet.create({})