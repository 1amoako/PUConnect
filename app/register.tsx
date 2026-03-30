import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, Layout } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { GlassButton } from "../components/GlassButton";
import { GlassContainer } from "../components/GlassContainer";
import { GlassTextInput } from "../components/GlassTextInput";
import { useTheme } from "../context/ThemeContext";



export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registering:", { email, firstName, lastName, username, password });
      router.push("/otp");
    }, 1500);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!email.includes("@") || email.length < 5) return setError("Please enter a valid email address.");
      if (username.trim().length === 0) return setError("Username is required.");
    }
    if (step === 2) {
      if (firstName.trim().length === 0 || lastName.trim().length === 0) return setError("First and Last name are required.");
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const getStepContent = () => {
    switch(step) {
      case 1:
        return {
          title: "Welcome to PUConnect",
          subtitle: "Let's kick things off with your basic details.",
        };
      case 2:
        return {
          title: "Personalize It",
          subtitle: "What should everyone call you?",
        };
      case 3:
        return {
          title: "Lock It Down",
          subtitle: "Create a strong password to protect your data.",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const stepMeta = getStepContent();

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
            <TouchableOpacity onPress={handleBack} style={[styles.backButton, { backgroundColor: colors.iconBackground }]}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Premium Step Indicator */}
          <View style={styles.indicatorContainer}>
            {[1, 2, 3].map((i) => {
              const isActive = step === i;
              const isCompleted = step > i;
              return (
                <View key={i} style={styles.stepGroup}>
                  <Animated.View 
                    layout={Layout.springify().damping(15)}
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isActive || isCompleted ? colors.primary : "transparent",
                        borderColor: isActive || isCompleted ? colors.primary : colors.border,
                        transform: [{ scale: isActive ? 1.25 : 1 }]
                      }
                    ]}
                  >
                    {isCompleted ? (
                      <Feather name="check" size={14} color={colors.background} />
                    ) : (
                      <Text style={[styles.stepText, { 
                        color: isActive ? colors.background : colors.text,
                        fontWeight: isActive ? "800" : "500" 
                      }]}>
                        {i}
                      </Text>
                    )}
                  </Animated.View>

                  {/* Connecting Line */}
                  {i < 3 && (
                    <View style={[styles.stepLine, { backgroundColor: colors.divider }]}>
                      <Animated.View 
                        layout={Layout.springify().damping(20)}
                        style={[
                          StyleSheet.absoluteFill,
                          { 
                            backgroundColor: colors.primary, 
                            width: isCompleted ? "100%" : "0%" 
                          }
                        ]}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Titles */}
          <View style={styles.titleContainer}>
            <Animated.Text 
              key={`title-${step}`} 
              entering={FadeIn.duration(400)} 
              exiting={FadeOut.duration(200)} 
              style={[styles.title, { color: colors.text }]}
            >
              {stepMeta.title}
            </Animated.Text>
            <Animated.Text 
              key={`sub-${step}`} 
              entering={FadeIn.duration(400).delay(100)} 
              exiting={FadeOut.duration(200)} 
              style={[styles.subtitle, { color: colors.mutedText }]}
            >
              {stepMeta.subtitle}
            </Animated.Text>
          </View>

          {/* Validation Error */}
          {error && (
            <Animated.Text 
              entering={FadeIn} 
              style={[styles.errorText, { color: colors.danger || 'red' }]}
            >
              {error}
            </Animated.Text>
          )}

          {/* Form Fields wrapped in Slide Animations */}
          <View style={styles.formContainer}>
            {step === 1 && (
              <Animated.View 
                key="step1" 
                entering={SlideInRight.springify().damping(20).stiffness(90)} 
                exiting={SlideOutLeft.springify().damping(20).stiffness(90)} 
                style={styles.stepForm}
              >
                <GlassContainer style={styles.inputCard}>
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Email Address</Text>
                  <GlassTextInput
                    placeholder="e.g. hello@puconnect.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.spacer} />
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Username</Text>
                  <GlassTextInput
                    placeholder="Choose a unique handle"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </GlassContainer>
              </Animated.View>
            )}

            {step === 2 && (
              <Animated.View 
                key="step2" 
                entering={SlideInRight.springify().damping(20).stiffness(90)} 
                exiting={SlideOutLeft.springify().damping(20).stiffness(90)} 
                style={styles.stepForm}
              >
                <GlassContainer style={styles.inputCard}>
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>First Name</Text>
                  <GlassTextInput
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  <View style={styles.spacer} />
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Last Name</Text>
                  <GlassTextInput
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </GlassContainer>
              </Animated.View>
            )}

            {step === 3 && (
              <Animated.View 
                key="step3" 
                entering={SlideInRight.springify().damping(20).stiffness(90)} 
                exiting={SlideOutLeft.springify().damping(20).stiffness(90)} 
                style={styles.stepForm}
              >
                <GlassContainer style={styles.inputCard}>
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Secure Password</Text>
                  <GlassTextInput
                    placeholder="Must be at least 8 characters"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                  />
                  <View style={styles.spacer} />
                  <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Confirm Password</Text>
                  <GlassTextInput
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    isPassword
                  />
                </GlassContainer>
              </Animated.View>
            )}
          </View>
        </ScrollView>

        {/* Sticky Bottom Action */}
        <Animated.View 
          layout={Layout.springify().damping(20)} 
          style={[styles.bottomActionContainer, { backgroundColor: colors.background, borderTopColor: colors.divider }]}
        >
           <GlassButton
              title={step < 3 ? "Continue" : "Complete Registration"}
              onPress={step < 3 ? handleNext : handleRegister}
              style={styles.primaryButton}
              isLoading={isLoading}
            />
            {step === 1 && (
              <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
                <Text style={[styles.loginText, { color: colors.mutedText }]}>
                  Already have an account? <Text style={[styles.loginTextBold, { color: colors.primary }]}>Log in</Text>
                </Text>
              </TouchableOpacity>
            )}
        </Animated.View>
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
    paddingBottom: 120, // Leave space for sticky footer
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCountText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  stepGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepText: {
    fontSize: 14,
  },
  stepLine: {
    width: 50,
    height: 3,
    marginHorizontal: -2,
    zIndex: 1,
    overflow: "hidden",
  },
  titleContainer: {
    marginBottom: 20,
    minHeight: 80, // Prevent jumps
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
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    position: "relative",
  },
  stepForm: {
    width: "100%",
  },
  inputCard: {
    padding: 25,
    borderRadius: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  spacer: {
    height: 20,
  },
  bottomActionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    maxWidth: 500,
    height: 56,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
  },
  loginTextBold: {
    fontWeight: "700",
  },
});
