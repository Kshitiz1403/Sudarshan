import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import colors from '../../theme/colors'
import useAuthService from '../../hooks/api/authService'
import sharedStyles from './sharedStyles'
import { useTheme } from '@react-navigation/native'
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')

  const authService = useAuthService()

  const forgot = async () => {
    await authService.forgot(email)
    navigation.navigate("Verification", { email })
  }

  const themeColors = useTheme().colors;

  return (
    <View style={sharedStyles.container}>
      <View style={sharedStyles.topContainer}>
        <Text style={{ ...sharedStyles.titleText, color: themeColors.text }}>Enter Email Address</Text>
        <TextInput
          style={{ ...sharedStyles.input, color: themeColors.text }}
          placeholderTextColor={colors.secondary}
          placeholder="name@example.com"
          textContentType="emailAddress"
          autoCorrect={false}
          autoCapitalize="none"
          value={email}
          onChangeText={t => setEmail(t)}
          onSubmitEditing={forgot}
        />
        <TouchableOpacity style={{ width: '100%' }} onPress={() => { navigation.navigate("Auth", { signIn: true, register: false }) }}>
          <Text style={sharedStyles.actionText}>Back to sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sharedStyles.button} onPress={forgot}>
          <Text style={sharedStyles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={sharedStyles.bottomContainer}>
        <Text style={{ ...sharedStyles.actionText, fontSize: 14 }}>Don't have an account?</Text>
        <TouchableOpacity style={{ ...sharedStyles.button, backgroundColor: themeColors.background, borderWidth: 1, borderStyle: "solid", borderColor: colors.secondary }} onPress={() => { navigation.navigate("Auth", { signIn: false, register: true }) }}>
          <Text style={{ ...sharedStyles.buttonText, color: colors.secondary }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPassword