import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import useOnboardingService from "../hooks/onboardingService";
import Onboarding from "../screens/Onboarding";

const Routes = () => {

    const isLoading = useSelector(state => state.auth.isLoading)
    const isSignedIn = useSelector(state => state.auth.isLoggedIn);
    const isOnboarded = useSelector(state => state.onboarding.isOnboarded)
    const onboardingService = useOnboardingService(); //required for initializing onboarding state
    const OnboardingStack = createNativeStackNavigator();


    const OnboardingScreens = () => (
        <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
            <OnboardingStack.Screen name="Onboarding" component={Onboarding} />
        </OnboardingStack.Navigator>
    )
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <View style={{ flex: 1 }}>
                    {/* {isLoading && <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', }}>Loading....</Text>
                    </View>} */}
                    {!isOnboarded && <OnboardingScreens />}

                </View>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default Routes;