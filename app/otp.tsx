import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { GlassButton } from "../components/GlassButton";
import { GlassContainer } from "../components/GlassContainer";

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    console.log("Verifying OTP:", otp);
    router.replace("/success");
  };

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const char = otp[i] || "";
      const isFocused = otp.length === i;
      boxes.push(
        <View 
          key={i} 
          style={[
            styles.otpBox,
            isFocused && styles.otpBoxFocused,
            char !== "" && styles.otpBoxFilled
          ]}
        >
          <Text style={styles.otpText}>{char}</Text>
        </View>
      );
    }
    return boxes;
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <GlassContainer style={styles.card}>
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

          <Pressable style={styles.otpContainer} onPress={handleBoxPress}>
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
            autoFocus
          />

          <GlassButton
            title="Verify & Activate"
            onPress={handleVerify}
            style={[styles.verifyButton, otp.length !== 6 && styles.buttonDisabled]}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive code?</Text>
            <GlassButton
              title="Resend Code"
              variant="secondary"
              onPress={() => console.log("Resending OTP...")}
              style={styles.resendButton}
            />
          </View>
        </GlassContainer>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  card: {
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 35,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginBottom: 30,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  otpBoxFocused: {
    borderColor: "#000",
    borderWidth: 2,
  },
  otpBoxFilled: {
    borderColor: "#000",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  verifyButton: {
    width: "100%",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    marginTop: 35,
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 8,
  },
  resendButton: {
    width: "100%",
  },
});
