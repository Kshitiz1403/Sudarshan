import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import colors from '../theme/colors'
import { FontAwesome5, MaterialIcons, Octicons } from '@expo/vector-icons'
import useAuthService from '../hooks/api/authService'

const CustomDrawer = ({ navigation, ...props }) => {

    const authService = useAuthService();

    const getMenuItem = (label, icon, key, navigateTo) => {
        return { label, icon, key, onPress: () => navigation.navigate(navigateTo) }
    }
    const getMenuItems = () => {
        let count = 0;
        const menuItems = [];
        menuItems.push(getMenuItem("Home", () => <Octicons name="home" size={24} color={colors.secondary} />, count++, "Home"))
        menuItems.push(getMenuItem("Running", () => <FontAwesome5 name="running" size={24} color={colors.secondary} />, count++, "Running"))

        return menuItems;
    }

    const logout = () => {
        authService.logout();
    }

    return (
        <DrawerContentScrollView {...props}>
            <View style={profileStyles.container}>
                <View style={profileStyles.imageWrapper}>
                    <View style={profileStyles.imageContainer}>
                        <Image style={profileStyles.image} source={{ uri: 'https://sudarshanstorage.blob.core.windows.net/store/profile_pic.jpg' }} />
                    </View>
                </View>
                <View style={profileStyles.nameContainer}>
                    <Text style={profileStyles.name} numberOfLines={2}>Kshitiz Agrawal</Text>
                </View>
            </View>
            {getMenuItems().map(item =>
                <DrawerItem activeTintColor={colors.primary} label={item.label} key={item.key} onPress={item.onPress} icon={item.icon} inactiveTintColor={colors.secondary} labelStyle={{ fontSize: 15 }} pressColor={colors.tertiary} />
            )}
            <View style={signOutStyles.wrapper}>
                <TouchableOpacity style={signOutStyles.container} activeOpacity={0.7} onPress={logout}>
                    <View style={signOutStyles.textContainer}>
                        <Text style={signOutStyles.text}>Sign Out</Text>
                    </View>
                    <View style={signOutStyles.iconContainer}>
                        <MaterialIcons name="logout" size={24} color={colors.secondary} style={signOutStyles.icon} />
                    </View>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView >
    )
}

export default CustomDrawer

const profileStyles = StyleSheet.create({
    container: { height: 75, flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.tertiary },
    imageWrapper: { flex: 0.4 },
    imageContainer: { padding: 10 },
    image: { height: '100%', borderRadius: 100, aspectRatio: 1, },
    nameContainer: { flex: 1, justifyContent: 'center' },
    name: { color: colors.secondary, fontWeight: '600', fontSize: 17, }
})

const signOutStyles = StyleSheet.create({
    wrapper: { height: 75, flex: 1, borderTopWidth: 1, borderColor: colors.tertiary, padding: 10, marginLeft: 5, justifyContent: 'center' },
    container: { flexDirection: 'row', height: '80%' },
    textContainer: { flex: 0.8, justifyContent: 'center', },
    text: { fontWeight: '600', color: colors.secondary, fontSize: 15 },
    iconContainer: { flex: 0.2, justifyContent: 'center' },
    icon: {}
})