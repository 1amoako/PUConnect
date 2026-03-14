import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GlassButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
}

export function GlassButton({ title, variant = 'primary', style, ...rest }: GlassButtonProps) {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.container,
                isPrimary ? styles.primaryContainer : styles.secondaryContainer,
                style
            ]}
            {...rest}
        >
            <Text style={isPrimary ? styles.textPrimary : styles.textSecondary}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
    },
    primaryContainer: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    secondaryContainer: {
        backgroundColor: '#fff',
        borderColor: '#000',
    },
    textPrimary: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    textSecondary: {
        fontSize: 14,
        color: '#000',
    },
});
