import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import useAuthService from "../hooks/api/authService";
import useOnboardingService from "../hooks/onboardingService";
import Auth from "../screens/Auth";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import VerifyPassword from "../screens/Auth/VerifyPassword";
import Onboarding from "../screens/Onboarding";
import Search from "../screens/Search";
import Welcome from "../screens/Welcome";

const Routes = () => {

    const isLoading = useSelector(state => state.auth.isLoading)
    const isSignedIn = useSelector(state => state.auth.isLoggedIn);
    const isOnboarded = useSelector(state => state.onboarding.isOnboarded)
    const onboardingService = useOnboardingService(); //required for initializing onboarding state
    const authService = useAuthService();
    const OnboardingStack = createNativeStackNavigator();
    const AuthStack = createNativeStackNavigator();
    const AppStack = createNativeStackNavigator();

    const dispatch = useDispatch()

    useEffect(() => {
        authService.getUserFromToken()
    }, [])

    const OnboardingScreens = () => (
        <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
            <OnboardingStack.Screen name="Onboarding" component={Onboarding} />
        </OnboardingStack.Navigator>
    )


    const AuthScreens = () => (
        <AuthStack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
            <AuthStack.Screen name="Welcome" component={Welcome} />
            <AuthStack.Screen name="Auth" component={Auth} />
            <AuthStack.Screen name="Forgot" component={ForgotPassword} options={{ headerShown: true, headerTitle: "Forgot Password" }} />
            <AuthStack.Screen name="Verification" component={VerifyPassword} options={{ headerShown: true, headerTitle: "Verification" }} />
        </AuthStack.Navigator>
    )

    const AppStackScreens = () => (
        <AppStack.Navigator>
            <AppStack.Screen />
        </AppStack.Navigator>
    )

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <View style={{ flex: 1 }}>
                    {isLoading && <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', }}>Loading....</Text>
                    </View>}
                    {!isOnboarded && <OnboardingScreens />}
                    {isOnboarded && !isSignedIn && <AuthScreens />}
                    {isOnboarded && isSignedIn && <Search />}
                </View>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default Routes;