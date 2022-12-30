import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ListContainer from './ListContainer';
import { useDispatch, useSelector } from 'react-redux';
import { selectDustbin } from '../../store/reducers/dustbinSlice';

const BottomSheetComponent = ({ place_name, place_address, distance, duration, navigation }) => {
    const bottomSheetRef = useRef(null);

    const dispatch = useDispatch();

    const dustbins = useSelector(state => state.dustbin.dustbins);
    const selectedDustbin = useSelector(state => state.dustbin.selectedDustbin);
    const selectedIndex = useSelector(state => state.dustbin.selectedIndex);

    const snapPoints = useMemo(() => ['15%', '42.5%'], [])
    return (
        <View style={styles.wrapper}>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >
                <View style={styles.topContainer}>
                    {/* <View style={styles.leftContainer}>
                    </View> */}
                    <View style={styles.rightContainer}>
                        <View>
                            <Text style={styles.title}>{place_name}</Text>
                        </View>
                        <View>
                            <Text style={styles.address} numberOfLines={2}>{place_address}</Text>
                        </View>
                        <View style={styles.iconsWrapper}>
                            <View style={styles.iconsContainer}>
                                <Feather name="trash-2" size={24} color={colors.primary} style={styles.icon} />
                                <Text style={styles.iconText}>{`${dustbins.length} Dustbin spots`}</Text>
                            </View>
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
                <View style={styles.bottomContainer}>
                    <Text style={styles.dustbinText}>Dustbins</Text>
                    <View style={{ height: 55 }}>
                        <BottomSheetScrollView horizontal={true} contentContainerStyle={{ marginBottom: 5, }} >
                            {dustbins.map((dustbin, index) => {
                                const distance = dustbin.distance.text;
                                const duration = dustbin.duration.text;

                                const isFocused = index == selectedIndex;

                                return <TouchableOpacity key={dustbin._id} activeOpacity={0.7} onPress={() => dispatch(selectDustbin({ index }))}><ListContainer duration={duration} distance={distance} isFocused={isFocused} /></TouchableOpacity>

                            })}
                        </BottomSheetScrollView>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        {dustbins && dustbins.length > 0 && selectedDustbin['dustbin_address'] && <Text numberOfLines={2}>{selectedDustbin.dustbin_address}</Text>}
                    </View>
                    {selectedIndex != -1 &&
                        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => navigation.navigate("Navigate")}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    }
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
    topContainer: {
        // flex: 1,
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
        // marginLeft: 20,
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
        marginTop: 20,
        marginBottom: 10
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
    },
    bottomContainer: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 10,
    },
    dustbinText: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 10
    },
    button: {
        height: 50,
        backgroundColor: colors.primary,
        marginHorizontal: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttonText: {
        fontWeight: '600',
        width: '100%',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: 'white',
        fontSize: 18
    }
})