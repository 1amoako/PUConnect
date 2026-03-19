import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function GlassTextInput(props: TextInputProps) {
    const { colors } = useTheme();
    return (
        <TextInput
            style={[styles.input, { 
                color: colors.text, 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.primary 
            }]}
            placeholderTextColor={colors.mutedText}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#000',
        marginVertical: 10,
        backgroundColor: '#fff',
    },
});
