import { DarkTheme, DefaultTheme, NavigationContainer, useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect } from "react";
import { Text, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import useAuthService from "../hooks/api/authService";
import useLocationService from "../hooks/locationService";
import useOnboardingService from "../hooks/onboardingService";
import Auth from "../screens/Auth";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import VerifyPassword from "../screens/Auth/VerifyPassword";
import Onboarding from "../screens/Onboarding";
import AskLocation from "../screens/RequestLocation/AskLocation";
import DeniedLocation from "../screens/RequestLocation/DeniedLocation";
import Running from "../screens/Running";
import Search from "../screens/Search";
import Welcome from "../screens/Welcome";
import Directions from "../screens/Directions";
import CustomDrawer from "./Drawer.js";
import PersonalDetails from "../screens/Auth/PersonalDetails";
import QRScreen from "../screens/QRScreen";
import Navigate from "../screens/Navigate";
import colors from "../theme/colors";
import Settings from "../screens/Settings";
import Loading from "../components/Loading";
import useThemeService from "../hooks/themeService";
import Report from "../screens/Report";
import Rewards from "../screens/Rewards";
import OngoingTrip from "../screens/OngoingTrip";

const Routes = () => {

    const isAuthLoading = useSelector(state => state.auth.isLoading)
    const isProfileCompleteLoading = useSelector(state => state.auth.isProfileCompleteLoading)
    const isSignedIn = useSelector(state => state.auth.isLoggedIn);
    const isProfileCompleted = useSelector(state => state.auth.isProfileComplete)
    const isOnboarded = useSelector(state => state.onboarding.isOnboarded)
    const isLocationPermissionLoading = useSelector(state => state.location.isGrantLoading)
    const isLocationPermissionGranted = useSelector(state => state.location.isPermissionGranted)
    const canAskAgainForLocation = useSelector(state => state.location.canAskAgain)
    const isLocationLoaded = useSelector(state => state.location.isLocationLoaded)
    const isDark = useSelector(state => state.theme.isDark)

    const onboardingService = useOnboardingService(); //required for initializing onboarding state
    const authService = useAuthService();
    const locationService = useLocationService();
    const themeService = useThemeService();

    const OnboardingStack = createNativeStackNavigator();
    const AuthStack = createNativeStackNavigator();
    const AppStack = createNativeStackNavigator();
    const ProfileCompletionStack = createNativeStackNavigator();

    const Drawer = createDrawerNavigator();

    const dispatch = useDispatch()

    const themeColors = useTheme().colors;

    useEffect(() => {
        themeService.mountTheme();
        locationService.checkPermissionGranted();
    }, [])

    useEffect(() => {
        (async () => {
            await authService.getUserFromToken()
            await authService.isProfileComplete();
        })();
    }, [isSignedIn])


    useEffect(() => {
        if (isLocationPermissionGranted) {
            (async () => {
                await locationService.getLastSavedLocation();
                const { latitude, longitude } = await locationService.watchCurrentLocation();
                const lastLocationUpdateTimerId = locationService.triggerUpdatingLastLocation({ latitude, longitude });
            })();
        }
    }, [isLocationPermissionGranted])

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

    const DrawerScreens = () => (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} >
            <Drawer.Screen name="Running" component={Running} options={{ headerShown: false }} />
            <Drawer.Screen name="Directions" component={Directions} options={{ headerShown: false, }} />
            <Drawer.Screen name="Rewards" component={Rewards} options={{ headerTitleAlign: 'center', headerStyle: { backgroundColor: isDark ? "#010101" : "#f2f2f2", }, headerShadowVisible: false, headerTintColor: colors.primary }} />
            <Drawer.Screen name="Settings" component={Settings} options={{ headerTitleAlign: 'center', headerStyle: { backgroundColor: colors.primary }, headerTintColor: 'white' }} />
        </Drawer.Navigator>
    )

    const AppScreens = () => (
        <AppStack.Navigator screenOptions={{ animation: "slide_from_right" }}>
            <AppStack.Screen name="Home" component={DrawerScreens} options={{ headerShown: false }} />
            <AppStack.Screen name="Search" component={Search} options={{ headerShown: false, unmountOnBlur: false }} />
            <AppStack.Screen name="Navigate" component={Navigate} options={{ headerShown: false, unmountOnBlur: true }} />
            <AppStack.Screen name="QR" component={QRScreen} options={{ headerTitleAlign: 'center', headerTitle: 'Scan QR Code', headerStyle: { backgroundColor: colors.primary }, headerTintColor: 'white', unmountOnBlur: true }} />
            <AppStack.Screen name="Profile" component={PersonalDetails} options={{ headerShown: false }} />
            <AppStack.Screen name="OngoingTrip" component={OngoingTrip} options={{ headerShown: false }} />
            <AppStack.Screen name="Report" component={Report}
                options={{
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: colors.primary },
                    headerShadowVisible: false,
                    headerTintColor: 'white',
                    headerTitle: 'Running Report',
                }} />
        </AppStack.Navigator>
    )

    const ProfileCompletionScreens = () => (
        <ProfileCompletionStack.Navigator>
            <ProfileCompletionStack.Screen name="ProfileComplete" component={PersonalDetails} options={{ headerShown: false }} />
        </ProfileCompletionStack.Navigator>
    )

    const scheme = useColorScheme();

    const MyDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: colors.primary,
        }
    }

    const MyLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.primary
        }
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer theme={isDark ? MyDarkTheme : MyLightTheme}>
                <View style={{ flex: 1 }}>
                    {isAuthLoading && <Loading />}
                    {!isAuthLoading && !isOnboarded && <OnboardingScreens />}
                    {!isAuthLoading && isOnboarded && !isSignedIn && <AuthScreens />}

                    {!isAuthLoading && isOnboarded && isSignedIn && isLocationPermissionLoading && <Loading title="Please wait while we are getting location permissions :)" />}

                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && !isLocationPermissionGranted && canAskAgainForLocation && <AskLocation />}
                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && !isLocationPermissionGranted && !canAskAgainForLocation && <DeniedLocation />}

                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && isLocationPermissionGranted && isProfileCompleteLoading && <Loading title="Profile Complete Screen Loading..." />}
                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && isLocationPermissionGranted && !isProfileCompleteLoading && !isProfileCompleted && <ProfileCompletionScreens />}

                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && isLocationPermissionGranted && !isProfileCompleteLoading && isProfileCompleted && !isLocationLoaded && <Loading title="Location is loading" />}
                    {!isAuthLoading && isOnboarded && isSignedIn && !isLocationPermissionLoading && isLocationPermissionGranted && !isProfileCompleteLoading && isProfileCompleted && isLocationLoaded && <AppScreens />}
                </View>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default Routes;