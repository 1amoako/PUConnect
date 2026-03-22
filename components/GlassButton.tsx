import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface GlassButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
    icon?: string;
}

export function GlassButton({ title, variant = 'primary', icon, style, ...rest }: GlassButtonProps) {
    const { colors } = useTheme();
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.container,
                { 
                    backgroundColor: isPrimary ? colors.primary : colors.background,
                    borderColor: colors.primary
                },
                style
            ]}
            {...rest}
        >
            {icon && (
                <Ionicons 
                    name={icon as any} 
                    size={20} 
                    color={isPrimary ? colors.background : colors.text} 
                    style={styles.icon}
                />
            )}
            <Text style={[
                isPrimary ? styles.textPrimary : styles.textSecondary,
                { color: isPrimary ? colors.background : colors.text }
            ]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        paddingHorizontal: 16,
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
    icon: {
        marginRight: 8,
    },
});
