import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessScreen() {
  const router = useRouter();
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
        router.replace("/feed");
      });
    }, 1500);

    return () => clearTimeout(fadeTimer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: pageFadeAnim }]}>
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
          <View style={styles.scallopPart} />
          <View style={[styles.scallopPart, { transform: [{ rotate: '45deg' }] }]} />
        </Animated.View>
        
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark" size={100} color="#000" />
        </View>
      </Animated.View>

      <Animated.Text 
        style={[
          styles.welcomeText, 
          { 
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
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
    elevation: 8,
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
