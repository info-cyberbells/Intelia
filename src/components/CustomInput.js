import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@react-native-vector-icons/feather'
import Fonts from '../styles/GolbalFonts';
import { useTheme } from '../contexts/ThemeContext';

const CustomInput = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    style = {},
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);  
    const [isFocused, setIsFocused] = useState(false);
    const theme = useTheme();
    const styles = stylee(theme);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const isPasswordField = secureTextEntry;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.inputContainer, style, isFocused && styles.focusedContainer]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.subText}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPasswordField && !isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {isPasswordField && (
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={22}
                            color={theme.subText}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const stylee = (theme) => StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.subText,
        borderRadius: 16,
        paddingHorizontal: 15,
        backgroundColor: theme.inputBackgroundcolor,
        paddingVertical: 4
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        color: theme.inputText,
        fontFamily: Fonts.RubikRegular
    },
    focusedContainer: {
        borderColor: theme.primary,
    }
});

export default CustomInput;
