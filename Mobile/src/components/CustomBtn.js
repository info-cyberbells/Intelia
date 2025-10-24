import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../styles/GolbalFonts';
import { useTheme } from '../contexts/ThemeContext';

const CustomBtn = ({
    title,
    onPress,
    variant = 'primary',
    icon,
    disabled = false,
    fullWidth = true
}) => {
     const theme = useTheme();
     const styles = style(theme);   



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

const style = (theme) => StyleSheet.create({
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
        backgroundColor: theme.primary,
    },
    secondaryButton: {
        backgroundColor:theme.inputBackgroundcolor,
    },
    outlineButton: {
        backgroundColor:theme.inputBackgroundcolor,
        borderWidth: 1,
        borderColor:theme.border,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color:theme.white,
        fontSize: moderateScale(16),
        fontFamily: Fonts.RubikSemiBold,
    },
    secondaryText: {
        color:theme.text,
        fontSize: moderateScale(14),
        fontFamily: Fonts.RubikSemiBold,
    },
    outlineText: {
        color:theme.text,
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