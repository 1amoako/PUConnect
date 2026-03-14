import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "../components/GlassButton";
import { GlassContainer } from "../components/GlassContainer";
import { GlassTextInput } from "../components/GlassTextInput";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    console.log("Login with:", username, password);
  };

  const handleCreateAccount = () => {
    router.push("/register");
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <GlassContainer style={styles.glassCard}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

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

          <GlassButton
            title="Login"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <GlassButton
              title="Create Account"
              variant="secondary"
              onPress={handleCreateAccount}
              style={styles.createAccountButton}
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
