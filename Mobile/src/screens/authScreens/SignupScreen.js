import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import CustomInput from '../../components/CustomInput';
import CustomBtn from '../../components/CustomBtn';
import Fonts from '../../styles/GolbalFonts';
import { useNavigation } from "@react-navigation/native";
import ImagePath from "../../contexts/ImagePath";
import { useTheme } from "../../contexts/ThemeContext";


const SignupScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
   const theme = useTheme();
    const style = styles(theme);

  const onHandleLogin = () => {
    navigation.navigate('Login')
  }

  const onSignup = () => {
    console.log('')
  }

  const onGoogleSignup = () => {
    console.log('')
  }

  return (
    <SafeAreaView style={style.main}>
      <ImageBackground source={ImagePath.backgroundImage} style={style.main}>
        <ScrollView style={style.innerMain} showsVerticalScrollIndicator={false}>
          <View>
            <View style={style.frontBox}>
              <Text style={style.headerText}>
                Join us{"\n"}Now!!
              </Text>
              <Text style={style.subHeaderText}>
                Let's Create your account
              </Text>
            </View>
            <View style={style.secandBox}>
              <Text style={[style.inputHeader, { marginTop: 0 }]}>
                Full Name
              </Text>
              <CustomInput
                placeholder="enter your name"
                value={name}
                onChangeText={setName}
                style={{ marginTop: 8 }}
              />
              <Text style={style.inputHeader}>
                Phone Number
              </Text>
              <CustomInput
                placeholder="enter your phonenumber"
                value={phonenumber}
                onChangeText={setPhoneNumber}
                style={{ marginTop: 8 }}
              />
              <Text style={style.inputHeader}>
                Email
              </Text>
              <CustomInput
                placeholder="admin@gmail.com"
                value={email}
                onChangeText={setEmail}
                style={{ marginTop: 8 }}
              />
              <Text style={style.inputHeader}>
                Password
              </Text>
              <CustomInput
                placeholder="enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 40 }}>
            <CustomBtn
              title="Sign in"
              variant="primary"
              onPress={onSignup}
            />
            <View style={style.dividerContainer}>
              <View style={style.divider} />
              <Text style={style.dividerText}>OR</Text>
              <View style={style.divider} />
            </View>
            <CustomBtn
              title="Continue with Google"
              variant="outline"
              icon={
                <Image
                  source={ImagePath.googleImage}
                  style={style.googleIcon}
                />
              }
              onPress={onGoogleSignup}

            />
            <View style={style.signupContainer}>
              <Text style={style.signupText}>Already have an Account?</Text>
              <TouchableOpacity onPress={onHandleLogin}>
                <Text style={style.signupLink}>
                  Login
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}


export default SignupScreen;

const styles = (theme) => StyleSheet.create({
  main: {
    flex: 1
  },
  innerMain: {
    flex: 1,
    paddingHorizontal: 18,

  },
  headerText: {
    fontSize: moderateScale(24),
    color:theme.text,
    fontFamily: Fonts.RubikBold
  },
  subHeaderText: {
    fontSize: moderateScale(12),
    color:theme.subText,
    fontFamily: Fonts.RubikMedium,
    marginTop: 10
  },
  frontBox: {
    marginTop: 20
  },
  secandBox: {
    marginTop: 25
  },
  inputHeader: {
    fontSize: moderateScale(16),
    color:theme.text,
    fontFamily: Fonts.RubikBold,
    marginTop: 20
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    justifyContent: "center"
  },
  divider: {
    flex: 0.1,
    height: 1,
    backgroundColor:theme.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color:theme.subText,
    fontSize: moderateScale(14),
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  signupText: {
    color:theme.subText,
    fontSize: moderateScale(12),
    fontFamily: Fonts.RubikRegular
  },
  signupLink: {
    color:theme.primary,
    fontSize: moderateScale(12),
    fontFamily: Fonts.RubikSemiBold
  },
})