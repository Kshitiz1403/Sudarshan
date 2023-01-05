import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import colors from '../../theme/colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import useDustbinService from '../../hooks/api/dustbinService'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { useIsFocused, useTheme } from '@react-navigation/native'
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner'

const QRScreen = ({ navigation }) => {

    const dustbinService = useDustbinService();

    const camera = useRef(null);
    const [hasPermission, setHasPermission] = useState(false);

    const devices = useCameraDevices();
    const [device, setDevice] = useState(null)
    const [isBarcodeScanned, setIsBarcodeScanned] = useState(false);
    const [selectedBarcode, setSelectedBarcode] = useState({})

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS], { checkInverted: true, });

    useEffect(() => {
        setDevice(devices.back)
    }, [devices])



    const flipCamera = () => {
        if (device == devices.back) {
            setDevice(devices.front)
            return
        }
        if (device == devices.front) {
            setDevice(devices.back);
            return;
        }
    }

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status == 'authorized')
        })();
    }, []);

    useEffect(() => {
        if (!barcodes || !barcodes.length > 0 || isBarcodeScanned) return;
        setIsBarcodeScanned(true)
        setSelectedBarcode(barcodes[0].displayValue)
    }, [barcodes])


    const isFocused = useIsFocused();
    const themeColors = useTheme().colors;

    return (
        <View style={{ flex: 1 }}>
            {!isBarcodeScanned && <View style={{ flex: 1, alignItems: 'center' }}>
                {hasPermission && device != null &&
                    <Camera style={{ width: '100%', aspectRatio: 1 }} device={device} isActive={isFocused} frameProcessor={frameProcessor} frameProcessorFps={5} />
                }
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity onPress={flipCamera}>
                        <MaterialIcons name="flip-camera-android" size={24} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    )
}

export default QRScreen

const styles = StyleSheet.create({})