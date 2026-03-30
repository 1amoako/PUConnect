import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Animated, { FadeIn, SlideInRight, Layout } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { GlassContainer } from "../components/GlassContainer";
import { useTheme } from "../context/ThemeContext";

export default function OTPScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setError(null);
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "123456") {
        console.log("Verifying OTP:", otp);
        router.replace("/success");
      } else {
        setError("Invalid code. Please try again.");
        setOtp("");
      }
    }, 1500);
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const char = otp[i] || "";
      const isFocused = otp.length === i;
      boxes.push(
        <Animated.View 
          key={i} 
          layout={Layout.springify()}
          style={[
            styles.otpBox,
            { 
              backgroundColor: colors.background,
              borderColor: isFocused ? colors.primary : (char !== "" ? colors.text : colors.border)
            },
            isFocused && styles.otpBoxFocused
          ]}
        >
          <Text style={[styles.otpText, { color: colors.text }]}>{char}</Text>
        </Animated.View>
      );
    }
    return boxes;
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.iconBackground }]}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Titles */}
          <View style={styles.titleContainer}>
            <Animated.Text 
              entering={FadeIn.duration(400)} 
              style={[styles.title, { color: colors.text }]}
            >
              Verify Account
            </Animated.Text>
            <Animated.Text 
              entering={FadeIn.duration(400).delay(100)} 
              style={[styles.subtitle, { color: colors.mutedText }]}
            >
              Enter the 6-digit code sent to your email.
            </Animated.Text>
          </View>

          <Animated.View entering={SlideInRight.springify().damping(20).stiffness(90)} style={styles.formContainer}>
            <GlassContainer style={styles.inputCard}>
              <Pressable style={styles.otpContainer} onPress={handleBoxPress} disabled={isLoading}>
                {renderOtpBoxes()}
              </Pressable>

              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={(text) => {
                  if (text.length <= 6) setOtp(text.replace(/[^0-9]/g, ""));
                }}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.hiddenInput}
                editable={!isLoading}
                autoFocus
              />

              {isLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 25 }} />
              )}
              {error && !isLoading && (
                <Animated.Text entering={FadeIn} style={[styles.errorText, { color: colors.danger || 'red' }]}>
                  {error}
                </Animated.Text>
              )}
            </GlassContainer>
            
            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: colors.mutedText }]}>Didn&apos;t receive code?</Text>
              <TouchableOpacity onPress={() => console.log("Resending OTP...")}>
                 <Text style={[styles.resendLink, { color: colors.primary }]}>Resend</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    marginBottom: 35,
    minHeight: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
  },
  inputCard: {
    padding: 25,
    paddingVertical: 35,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFocused: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 6,
  },
  resendText: {
    fontSize: 15,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 25,
  },
});
