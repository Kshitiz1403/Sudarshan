import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import sharedStyles from './sharedStyles'
import colors from '../../theme/colors'
import OtpInput from '../../components/OtpInput'
import useAuthService from '../../hooks/api/authService'

const VerifyPassword = ({ navigation, route }) => {

  const [otpCode, setOTPCode] = useState("")
  const [isPinReady, setIsPinReady] = useState(false)
  const maximumCodeLength = 6;

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const authService = useAuthService();

  useEffect(() => {
    if (route.params && route.params['email']) { setEmail(route.params['email']); }
  }, [])

  const reset = async () => {
    authService.reset(email, otpCode, password)
  }

  return (
    <View style={sharedStyles.container}>
      <View style={{ ...sharedStyles.topContainer, flex: 0.7 }}>
        <Text style={sharedStyles.titleText}>Enter Verification Code</Text>
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <OtpInput code={otpCode} setCode={setOTPCode} maximumLength={maximumCodeLength} setIsPinReady={setIsPinReady} />
        </View>
        <Text style={{ ...sharedStyles.titleText, marginBottom: 5 }}>New Password</Text>
        <TextInput style={sharedStyles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Text style={sharedStyles.actionText}>
          If you didn't receive a code,
          <Text style={{ color: colors.primary }} onPress={() => { }}> Resend</Text>
        </Text>
        <TouchableOpacity style={sharedStyles.button} onPress={reset}>
          <Text style={sharedStyles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={{ ...sharedStyles.bottomContainer, flex: 0.1 }}>
        <Text style={{ ...sharedStyles.actionText, fontSize: 14 }}>Don't have an account?</Text>
        <TouchableOpacity style={{ ...sharedStyles.button, backgroundColor: 'white', borderWidth: 1, borderStyle: "solid", borderColor: colors.secondary }} onPress={() => { navigation.navigate("Auth", { signIn: false, register: true }) }}>
          <Text style={{ ...sharedStyles.buttonText, color: colors.secondary }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View >
  )
}

export default VerifyPassword

const styles = StyleSheet.create({})