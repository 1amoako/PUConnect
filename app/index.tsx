import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "../components/GlassButton";
import { GlassContainer } from "../components/GlassContainer";
import { GlassTextInput } from "../components/GlassTextInput";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Login with:", username, password);
    router.replace("/success");
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <GlassContainer style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Sign in to continue</Text>

          <GlassTextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <GlassTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.forgotPasswordContainer}>
            <Text 
              style={[styles.forgotPasswordText, { color: colors.text }]}
              onPress={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </Text>
          </View>

          <GlassButton
            title="Login"
            onPress={handleLogin}
            style={[styles.loginButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>New here?</Text>
            <GlassButton
              title="Create Account"
              variant="secondary"
              onPress={handleCreateAccount}
              style={[styles.createAccountButton, { borderColor: colors.primary }]}
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
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  glassCard: {
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
  },
  loginButton: {
    marginTop: 20,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  forgotPasswordText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#333333",
    fontSize: 14,
    marginBottom: 10,
  },
  createAccountButton: {
    width: "100%",
  },
});
