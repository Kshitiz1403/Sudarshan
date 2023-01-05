import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import Progress from '../../components/Progress'
import { useDispatch } from 'react-redux'
import { completeOnboarding } from '../../store/reducers/onboardingSlice'


const OnboardingItem = ({ onboarding }) => <View style={styles.onBoardingContainer}>
    <ImageBackground
        source={onboarding.imageBackground}
        style={styles.image}
    />
    <Text style={styles.titles}>{onboarding.title}</Text>
    <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>
            {onboarding.subtitle}
        </Text>
        <Text style={styles.subtitleText}>
            {onboarding.subtitleText}
        </Text>
    </View>
    <View style={buttonStyle.container}>
        <Progress length={onboarding.progress.length} activeIndex={onboarding.progress.activeIndex} />
        <TouchableOpacity
            style={buttonStyle.button}
            onPress={onboarding.onPress}
        >
            <Text style={buttonStyle.text}>Next</Text>
        </TouchableOpacity>
    </View>
</View>

const Onboarding = () => {
    const dispatch = useDispatch()
    const [indexToDisplay, setIndexToDisplay] = useState(0)
    // const images = [require("../../assets/Onboarding/1.png"), require("../../assets/Onboarding/2.png"), require("../../assets/Onboarding/3.png")]
    // const cache = () => {
    //     const cacheImages = (images) => {
    //         images.map(image => Asset.fromModule(image).downloadAsync())
    //     }
    //     return Promise.all(...cacheImages(images));
    // }
    // useEffect(() => {
    //     (async () => {
    //         await cache();
    //     })();
    // }, [])


    const onboardings = [
        { imageBackground: require("../../assets/Onboarding/1.png"), title: "Have a good health", subtitle: "Being healthy is all, no health is nothing.", subtitleText: "So why don't we jog!!!", progress: { activeIndex: 0, length: 3 }, onPress: () => handleIncrement() },
        { imageBackground: require("../../assets/Onboarding/2.png"), title: "Contribute to the environment", subtitle: "While jogging, you can dump wastes", subtitleText: "to help the environment and be healthy", progress: { activeIndex: 1, length: 3 }, onPress: () => handleIncrement() },
        { imageBackground: require("../../assets/Onboarding/3.png"), title: "Have nice body", subtitle: "Build better body and earth together with", subtitleText: "our specialized features", progress: { activeIndex: 2, length: 3 }, onPress: () => handleIncrement() }
    ]

    const handleIncrement = () => {
        if (indexToDisplay == onboardings.length - 1) {
            dispatch(completeOnboarding())
            return
        }
        setIndexToDisplay(i => i + 1)
    }
    const handleDecrement = () => {
        if (indexToDisplay == 0) return;
        setIndexToDisplay(i => i - 1)
    }

    return (
        <View>
            <GestureRecognizer onSwipeLeft={handleIncrement} onSwipeRight={handleDecrement} >
                <OnboardingItem onboarding={onboardings[indexToDisplay]} />
            </GestureRecognizer>
        </View>
    )
}

const styles = StyleSheet.create({
    onBoardingContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    titles: {
        marginTop: "15%",
        fontSize: 25,
        fontWeight: "600",
        color: "#56CCF2",
        width: '100%',
        textAlign: 'center',
    },
    subtitle: {
        alignItems: "center",
        position: "absolute",
        bottom: "22.5%",
    },
    subtitleText: {
        color: "rgba(255,255,255,0.8)",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        position: "absolute",
    },
});

const buttonStyle = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 50,
        width: "100%",
        padding: 30,
        marginTop: "10%",
    },
    button: {
        backgroundColor: "white",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    text: {
        fontSize: 15,
        fontWeight: "500",
        textTransform: "uppercase",
        color: "#56CCF2",
    },
});

export default Onboarding