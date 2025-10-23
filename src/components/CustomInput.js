import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@react-native-vector-icons/feather'
import Fonts from '../styles/GolbalFonts';

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

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const isPasswordField = secureTextEntry;

    return (
        <View style={[styles.inputContainer, style, isFocused && styles.focusedContainer,]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#BDBDBD"
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
                        color="#BDBDBD"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 16,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        paddingVertical: 4
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        color: '#000',
        fontFamily: Fonts.RubikRegular
    },
     focusedContainer: {
    borderColor: '#3565E3CC', 
  }
});

export default CustomInput;
