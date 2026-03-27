import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export interface GlassTextInputProps extends TextInputProps {
    isPassword?: boolean;
    containerStyle?: any;
}

export function GlassTextInput(props: GlassTextInputProps) {
    const { colors } = useTheme();
    const { isPassword, secureTextEntry, style, containerStyle, ...restProps } = props;
    const [isSecure, setIsSecure] = useState(true);

    const toggleSecureEntry = () => {
        setIsSecure(!isSecure);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, { 
                    color: colors.text, 
                    backgroundColor: colors.cardBackground, 
                    borderColor: colors.border, // Use border color instead of primary for a more subtle look
                }, style]}
                placeholderTextColor={colors.mutedText}
                secureTextEntry={isPassword ? isSecure : secureTextEntry}
                {...restProps}
            />
            {isPassword && (
                <TouchableOpacity 
                    style={styles.iconContainer} 
                    onPress={toggleSecureEntry}
                    activeOpacity={0.7}
                >
                    <Feather 
                        name={isSecure ? "eye-off" : "eye"} 
                        size={20} 
                        color={colors.mutedText || '#666'} 
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        paddingRight: 45, // Make room for the icon
        fontSize: 16,
        color: '#000',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
    },
});
