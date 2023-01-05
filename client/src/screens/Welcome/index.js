import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Progress from '../../components/Progress'
import GestureRecognizer from 'react-native-swipe-gestures'
import colors from '../../theme/colors'

const Welcome = ({ navigation }) => {
    return (
        <View style={styles.onBoardingContainer}>
            <GestureRecognizer style={{ flex: 1 }} onSwipeLeft={() => navigation.navigate("Auth")} >
                <Text style={styles.titles}>Step 1 of 2</Text>
                <Image
                    source={require("../../assets/Welcome/running-people.png")}
                    style={styles.image}
                />

                <View style={styles.welcome}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.welcomeText}>SUDARSHAN</Text>
                </View>

                <View style={styles.subtitle}>
                    <Text style={styles.subtitleText}>
                        Our app is based on the concept of plogging and helps to calculate
                        calories burnt
                    </Text>
                </View>

                <View style={buttonStyle.container}>
                    <TouchableOpacity
                        style={buttonStyle.button}
                        onPress={() => navigation.navigate("Auth")}
                    >
                        <Text style={buttonStyle.text}>Get Started</Text>
                    </TouchableOpacity>
                    <Progress length={2} unselectedColor={colors.secondary} selectedColor={colors.primary} activeIndex={0} />
                </View>
            </GestureRecognizer>
        </View>
    )
}

export default Welcome
const styles = StyleSheet.create({
    onBoardingContainer: {
        flex: 1,
    },
    titles: {
        alignSelf: "center",
        marginTop: "10%",
        fontSize: 25,
        fontWeight: "600",
        color: colors.primary,
        width: '100%',
        textAlign: 'center'
    },
    image: {
        width: '100%',
        resizeMode: "contain",
        flex: 0.7
    },
    welcome: {
        marginVertical: 10,
        alignItems: "center",
        marginBottom: 25,
    },
    welcomeText: {
        color: "gray",
        fontWeight: "bold",
        fontSize: 22.5,
        width: '100%',
        textAlign: 'center'
    },
    subtitle: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: "15%",
    },
    subtitleText: {
        fontWeight: '100',
        color: 'black',
        width: '100%',
        textAlign: 'center'
    },
});

const buttonStyle = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: "0%",
        width: "100%",
        padding: 30,
        marginTop: "10%",
    },
    button: {
        backgroundColor: colors.primary,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    text: {
        fontSize: 15,
        fontWeight: "500",
        color: "white",
        width: '100%',
        textAlign: 'center'
    },
});