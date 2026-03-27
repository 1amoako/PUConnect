import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SuccessScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pageFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade out and navigate
    const fadeTimer = setTimeout(() => {
      Animated.timing(pageFadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        router.replace({
          pathname: "/feed",
          params: { role }
        });
      });
    }, 1500);

    return () => clearTimeout(fadeTimer);
  }, [opacityAnim, pageFadeAnim, role, rotateAnim, router, scaleAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: pageFadeAnim, backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.cloverContainer, 
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim 
          }
        ]}
      >
        {/* Layering two boxes with high border radius to create a 'Clover' scalloped shape */}
        <Animated.View style={[styles.backgroundWrapper, { transform: [{ rotate: spin }] }]}>
          <View style={[styles.scallopPart, { backgroundColor: colors.primary }]} />
          <View style={[styles.scallopPart, { transform: [{ rotate: '45deg' }], backgroundColor: colors.primary }]} />
        </Animated.View>
        
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark" size={100} color={colors.background} />
        </View>
      </Animated.View>

      <Animated.Text 
        style={[
          styles.welcomeText, 
          { 
            color: colors.text,
            opacity: opacityAnim,
            transform: [{ translateY: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }]
          }
        ]}
      >
        Welcome!
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cloverContainer: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundWrapper: {
    position: 'absolute',
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  scallopPart: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 60,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    boxShadow: "0 6 15 rgba(0, 0, 0, 0.15)",
  },
  iconWrapper: {
    zIndex: 10,
  },
  welcomeText: {
    marginTop: 40,
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 1,
  },
});
