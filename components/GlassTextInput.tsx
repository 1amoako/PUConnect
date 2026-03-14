import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export function GlassTextInput(props: TextInputProps) {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor="#888"
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
