import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../styles/GolbalFonts';

const CustomBtn = ({
    title,
    onPress,
    variant = 'primary',
    icon,
    disabled = false,
    fullWidth = true
}) => {
    const buttonStyles = [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabled
    ];

    const textStyles = [
        styles.buttonText,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {icon !== null && icon !== undefined && (
                <View style={styles.iconContainer}>{icon}</View>
            )}
            <Text style={textStyles}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomBtn;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 5,
    },
    fullWidth: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#3565E3',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
    },
    outlineButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontFamily: Fonts.RubikSemiBold,
    },
    secondaryText: {
        color: '#333333',
        fontSize: moderateScale(14),
        fontFamily: Fonts.RubikSemiBold,
    },
    outlineText: {
        color: '#333333',
        fontSize: moderateScale(14),
        fontFamily: Fonts.RubikMedium
    },
    iconContainer: {
        marginRight: 10,
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
});