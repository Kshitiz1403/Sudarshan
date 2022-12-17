import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Progress from '../../components/Progress';
import GestureRecognizer from 'react-native-swipe-gestures';
import useAuthService from '../../hooks/api/authService';
import colors from '../../theme/colors';

const Auth = ({ navigation, route }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isRegistering, setIsRegistering] = useState(false)

    useEffect(() => {
        if (route.params && route.params['signIn'] == true) { setIsRegistering(false); return; }
        if (route.params && route.params['register'] == true) { setIsRegistering(true); return; }
    }, [])

    const authService = useAuthService();
    const signIn = () => {
        authService.login(email, password)
    };
    const signUp = () => {
        authService.signup(email, password)
    };

    return (
        <View style={styles.container}>
            <GestureRecognizer style={{ flex: 1 }} onSwipeRight={() => navigation.navigate("Welcome")}>
                <View style={styles.topContainer}>
                    <Text style={styles.stepText}>Step 2 of 2</Text>
                    <Image
                        source={require("../../assets/Welcome/running-people.png")}
                        style={styles.image}
                    />
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsRegistering(false)} style={{ ...styles.actionButton, borderBottomWidth: isRegistering ? 0 : 3 }}>
                            <Text style={styles.actionText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsRegistering(true)} style={{ ...styles.actionButton, borderBottomWidth: isRegistering ? 3 : 0 }}>
                            <Text style={styles.actionText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomContainer}>
                    <View style={styles.inputContainer}>
                        <View style={styles.subInputContainer}>
                            <Text style={styles.inputTitle}>Email address</Text>
                            <TextInput style={styles.input}
                                placeholder="Email"
                                textContentType="email"
                                autoCorrect={false}
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>
                        <View style={styles.subInputContainer}>
                            <Text style={styles.inputTitle}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </View>
                        {!isRegistering && <TouchableOpacity onPress={() => navigation.navigate("Forgot")}><Text style={styles.forgotPasswordText}>Forgot Password?</Text></TouchableOpacity>}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={isRegistering ? signUp : signIn}>
                            <Text style={styles.buttonText}>{isRegistering ? "Register" : "Login"}</Text>
                        </TouchableOpacity>
                        <Progress length={2} activeIndex={1} unselectedColor='#949397' selectedColor='#56CCF2' />
                    </View>
                </View>
            </GestureRecognizer>
        </View>
    )
}

export default Auth


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0E0E000",
    },
    stepText: {
        alignSelf: "center",
        marginTop: "10%",
        fontSize: 25,
        fontWeight: "600",
        color: colors.primary,
        textAlign: 'center',
        width: '100%',
    },
    topContainer: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'white',
        flex: 0.5
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        aspectRatio: 1.2,
        alignSelf: 'center',
    },
    actionButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    actionButton: {
        height: 50,
        width: '30%',
        justifyContent: 'center',
        borderColor: colors.primary,
        borderStyle: 'solid'
    },
    actionText: {
        textAlign: 'center', fontWeight: '500', fontSize: 18
    },
    bottomContainer: {
        marginTop: 30,
        flex: 0.5,
        paddingHorizontal: 20
    },
    inputContainer: {
        flex: 0.8
    },
    subInputContainer: {
        marginBottom: 30
    },
    inputTitle: {
        fontWeight: '500',
        marginBottom: 5
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: colors.secondary,
        fontSize: 16,
        fontWeight: '600'
    },
    forgotPasswordText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 15
    },
    buttonContainer: {
        flex: 0.25,
    },
    button: {
        backgroundColor: colors.primary,
        height: 40,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%'
    }
});
