import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '../theme/colors';

const BottomSheetComponent = ({distance, duration}) => {
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['15%', '40%'], [])
    return (
        <View style={styles.wrapper}>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                    </View>
                    <View style={styles.rightContainer}>
                        <View>
                            <Text style={styles.title}>Riddhi Siddhi</Text>
                        </View>
                        <View>
                            <Text style={styles.address} numberOfLines={2}>Addresss Eiusmod adipisicing eu non do eiusmod officia commodo laborum.</Text>
                        </View>
                        <View style={styles.iconsWrapper}>
                            <View style={styles.iconsContainer}>
                                <FontAwesome5 name="directions" size={24} color={colors.primary} style={styles.icon} />
                                <Text style={styles.iconText}>{distance}</Text>
                            </View>
                            <View style={styles.iconsContainer}>
                                <FontAwesome5 name="walking" size={24} color={colors.primary} style={styles.icon} />
                                <Text style={styles.iconText}>{duration}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </BottomSheet>
        </View>
    )
}

export default BottomSheetComponent

const styles = StyleSheet.create({
    wrapper: {
        height: '100%'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    leftContainer: {
        backgroundColor: 'blue',
        flex: 0.4,
        borderRadius: 10,
        aspectRatio: 1
    },
    rightContainer: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    address: {
        color: colors.secondary,
        fontSize: 13
    },
    iconsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10
    },
    iconText: {
        color: colors.secondary,
    }
})