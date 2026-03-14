import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface GlassContainerProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassContainer({ children, style, ...rest }: GlassContainerProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
    padding: 24,
  },
});
