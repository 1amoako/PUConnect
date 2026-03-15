import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlassButton } from "../components/GlassButton";
import { GlassContainer } from "../components/GlassContainer";
import { GlassTextInput } from "../components/GlassTextInput";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Implement registration logic here
    console.log("Registering:", { email, firstName, lastName, username, password });
    router.push("/otp");
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassContainer style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>

            <GlassTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.row}>
              <View style={styles.flex1}>
                <GlassTextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.width10} />
              <View style={styles.flex1}>
                <GlassTextInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

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

            <GlassTextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <GlassButton
              title="Create Account"
              onPress={handleRegister}
              style={styles.registerButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <GlassButton
                title="Login"
                variant="secondary"
                onPress={() => router.back()}
                style={styles.loginButton}
              />
            </View>
          </GlassContainer>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingVertical: 40,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  card: {
    paddingVertical: 30,
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
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
  width10: {
    width: 10,
  },
  registerButton: {
    marginTop: 15,
  },
  footer: {
    marginTop: 25,
    alignItems: "center",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 8,
  },
  loginButton: {
    width: "100%",
  },
});
