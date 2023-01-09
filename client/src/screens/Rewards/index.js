import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ThemedText from '../../components/ThemedText'
import OpenBox from '../../components/Rewards/OpenBox'
import ClosedBox from '../../components/Rewards/ClosedBox'
import Cash from '../../components/Rewards/Cash'
import { useTheme } from '@react-navigation/native'
import colors from '../../theme/colors'
import { useState } from 'react'
import GestureRecognizer from 'react-native-swipe-gestures'

const Rewards = () => {
    const themeColors = useTheme().colors;
    const time = new Date();

    const [isUserViewingPromoCodes, setIsPromoCodeSelected] = useState(true)
    const [isScratched, setIsScratched] = useState(false)

    const getMockPromos = () => {
        let count = 0;
        const promos = [];
        promos.push(
            { brandName: "30 dEGREE", calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { brandName: "30 dEGREE", calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { brandName: "30 dEGREE", calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { brandName: "30 dEGREE", calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { brandName: "30 dEGREE", calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
        )
        return promos;
    }

    const getMockCash = () => {
        let count = 0;
        const cash = [];
        cash.push(
            { amount: 20, calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { amount: 20, calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { amount: 20, calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { amount: 20, calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
            { amount: 20, calories: 482, distanceKM: 2.6, onPress: () => { }, id: count++ },
        )
        return cash;
    }

    const Item = ({ isCash = false, amount, brandName = "", calories, distanceKM, onPress = () => { } }) =>
        <View style={{ ...listItemStyles.container, backgroundColor: themeColors.card }}>
            <View>
                <Text style={listItemStyles.time}>{time.toLocaleString()}</Text>
                <ThemedText style={{ ...listItemStyles.title, fontSize: isCash ? 24 : 18, }}>{isCash && `₹ ${amount}`}{!isCash && brandName}</ThemedText>
                <ThemedText>You burnt <Text style={listItemStyles.highlightedText}>{calories}</Text> while running <Text style={listItemStyles.highlightedText}>{distanceKM}</Text> km.</ThemedText>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={listItemStyles.button} onPress={onPress}>
                <Text style={{ color: 'white', width: '100%' }}>See more</Text>
            </TouchableOpacity>

        </View>

    return (
        <GestureRecognizer style={styles.wrapper} onSwipeLeft={() => setIsPromoCodeSelected(false)} onSwipeRight={() => setIsPromoCodeSelected(true)}>
            <View style={selectorStyles.wrapper}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsPromoCodeSelected(true)} style={{ ...selectorStyles.container, borderBottomWidth: isUserViewingPromoCodes ? 2 : 0, }}>
                    <ThemedText style={{ ...selectorStyles.label, fontWeight: isUserViewingPromoCodes ? '600' : '400', }}>Promo Codes</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsPromoCodeSelected(false)} style={{ ...selectorStyles.container, borderBottomWidth: !isUserViewingPromoCodes ? 2 : 0, }}>
                    <ThemedText style={{
                        ...selectorStyles.label, fontWeight: !isUserViewingPromoCodes ? '600' : '400',
                    }}>Cash</ThemedText>
                </TouchableOpacity>
            </View >
            <ThemedText style={styles.title}>{isUserViewingPromoCodes ? "Promo Codes" : "Cash"}</ThemedText>
            {isUserViewingPromoCodes &&
                <FlatList
                    ListHeaderComponent={isScratched ? <OpenBox label="50% OFF!" /> : <ClosedBox onPress={() => setIsScratched(true)} />}
                    data={getMockPromos()} renderItem={({ item }) => {
                        return <Item brandName={item.brandName} distanceKM={item.distanceKM} key={item.id} calories={item.calories} />
                    }} />
            }
            {!isUserViewingPromoCodes &&
                <FlatList
                    ListHeaderComponent={<Cash />}
                    data={getMockCash()}
                    renderItem={({ item }) => {
                        return <Item isCash={true} amount={item.amount} distanceKM={item.distanceKM} key={item.id} calories={item.calories} />
                    }}
                />}

        </GestureRecognizer>

    )
}

export default Rewards

const listItemStyles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        height: 150,
        padding: 10,
        justifyContent: 'space-between',
        shadowColor: colors.secondary,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        marginBottom: 10,
        borderRadius: 5
    },
    time: {
        color: colors.primary,
        fontWeight: '600',
        width: '100%',
        marginBottom: 10
    },
    title: {
        fontWeight: '600',
        marginBottom: 10,

    },
    highlightedText: {
        color: colors.primary,
        fontWeight: '500'
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 5
    }
})

const selectorStyles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        height: 50,
        marginBottom: 20
    },
    container: {
        flex: 0.5,
        alignItems: 'center',
        borderColor: colors.primary,
        justifyContent: 'center'
    },
    label: {
        width: '100%',
        textAlign: 'center'
    }
})

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    title: {
        textTransform: "uppercase",
        textAlign: "center",
        fontSize: 18,
        fontWeight: '500',
        width: '100%',
        marginBottom: 10
    }
})