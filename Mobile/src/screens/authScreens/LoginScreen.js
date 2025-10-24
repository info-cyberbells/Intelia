import React, { useState } from "react";
import { Image, ImageBackground, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import CustomInput from '../../components/CustomInput';
import CustomBtn from '../../components/CustomBtn'
import Fonts from '../../styles/GolbalFonts';
import ImagePath from '../../contexts/ImagePath'
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";


const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();  
  const theme = useTheme();
  const style = styles(theme);
 
  const onHandleSignup = () => {
    navigation.navigate('Signup')
  }

  const onLogin = () => {
    console.log('')
  }

  const onGoogleLogin = () => {
    console.log('')
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={style.main}>
        <ImageBackground source={ImagePath.backgroundImage} style={style.main}>
          <View style={style.innerMain}>
            <View>
              <View style={style.frontBox}>
                <Text style={style.headerText}>
                  Hey, {"\n"}Welcome Back
                </Text>
                <Text style={style.subHeaderText}>
                  Please login your account
                </Text>
              </View>
              <View style={style.secandBox}>
                <Text style={style.inputHeader}>
                  Email
                </Text>
                <CustomInput
                  placeholder="admin@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  style={{ marginTop: 10 }}
                />
                <Text style={[style.inputHeader, { marginTop: 20 }]}>
                  Password
                </Text>
                <CustomInput
                  placeholder="enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={{ marginTop: 10 }}
                />
                <Text style={style.forgetText}>
                  Forget Password
                </Text>
              </View>
            </View>
            <View>
              <CustomBtn
                title="Login"
                variant="primary"
                onPress={onLogin}
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
                onPress={onGoogleLogin}
              />
              <View style={style.signupContainer}>
                <Text style={style.signupText}>Didn't have an Account? </Text>
                <TouchableOpacity onPress={onHandleSignup}>
                  <Text style={style.signupLink} >
                    Sign-up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}


export default LoginScreen;

const styles = (theme) => StyleSheet.create({
  main: {
    flex: 1
  },
  innerMain: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: moderateScale(24),
    color: theme.text,
    fontFamily: Fonts.RubikBold
  },
  subHeaderText: {
    fontSize: moderateScale(12),
    color: theme.subText,
    fontFamily: Fonts.RubikMedium
  },
  frontBox: {
    marginTop: 10
  },
  secandBox: {
    marginTop: 25
  },
  inputHeader: {
    fontSize: moderateScale(16),
    color: theme.text,
    fontFamily: Fonts.RubikBold
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
    backgroundColor: theme.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.subText,
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
    color: theme.subText,
    fontSize: moderateScale(12),
    fontFamily: Fonts.RubikRegular
  },
  signupLink: {
    color: theme.primary,
    fontSize: moderateScale(12),
    fontFamily: Fonts.RubikSemiBold
  },
  forgetText: {
    alignSelf: 'flex-end',
    marginTop: 13,
    color: theme.primary,
    fontSize: moderateScale(14),
    fontFamily: Fonts.RubikMedium
  }
})