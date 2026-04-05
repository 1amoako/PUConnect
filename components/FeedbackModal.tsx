import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";
import { GlassTextInput } from "./GlassTextInput";

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (category: string, suggestion: string, impact: string) => void;
  isDesktop: boolean;
}

const CATEGORIES = ["Feature Request", "UI/UX", "Issue", "Other"];

export function FeedbackModal({ visible, onClose, onSubmit, isDesktop }: FeedbackModalProps) {
  const { colors } = useTheme();
  const [category, setCategory] = useState("Feature Request");
  const [suggestion, setSuggestion] = useState("");
  const [impact, setImpact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!suggestion.trim()) return;

    setIsSubmitting(true);
    // Logic for submission (mocking)
    setTimeout(() => {
      onSubmit(category, suggestion, impact);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Cleanup and close after a delay
      setTimeout(() => {
        setShowSuccess(false);
        setSuggestion("");
        setImpact("");
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <GlassContainer style={[styles.modalContent, isDesktop && styles.modalContentDesktop, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {showSuccess ? (
            <View style={styles.successContainer}>
              <View style={[styles.successIconBox, { backgroundColor: colors.primary + '1A' }]}>
                <Ionicons name="checkmark-done-circle" size={60} color={colors.primary} />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Feedback Shared!</Text>
              <Text style={[styles.successSub, { color: colors.mutedText }]}>
                 Thank you for helping us improve PUConnect. Our admins will review this shortly.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Share Feedback</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.iconBackground }]}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.description, { color: colors.secondaryText }]}>
                Have a suggestion or found an issue? Let us know how we can make PUConnect better for you.
              </Text>

              {/* Category Pills */}
              <Text style={[styles.label, { color: colors.mutedText }]}>What is this feedback about?</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catPill,
                      { backgroundColor: category === cat ? colors.primary : colors.iconBackground }
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catText, { color: category === cat ? colors.background : colors.text }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Suggestion Input */}
              <Text style={[styles.label, { color: colors.mutedText }]}>The Suggestion / Issue</Text>
              <GlassTextInput
                placeholder="What can we improve? Or what issue did you encounter?"
                value={suggestion}
                onChangeText={setSuggestion}
                multiline
                style={[styles.textArea, { backgroundColor: colors.iconBackground, borderColor: colors.divider }]}
              />

              {/* Impact Input (Matching Admin Side) */}
              <Text style={[styles.label, { color: colors.mutedText }]}>Expected Impact (Optional)</Text>
              <GlassTextInput
                placeholder="How will this change help you or others?"
                value={impact}
                onChangeText={setImpact}
                style={[styles.input, { backgroundColor: colors.iconBackground, borderColor: colors.divider }]}
              />

              <GlassButton
                title={isSubmitting ? "Submitting..." : "Send Feedback"}
                onPress={handleSubmit}
                disabled={!suggestion.trim() || isSubmitting}
                style={styles.submitBtn}
              />
            </ScrollView>
          )}
        </GlassContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 32,
    borderWidth: 1,
    padding: 25,
    overflow: "hidden",
  },
  modalContentDesktop: {
    maxWidth: 500,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 5,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 25,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  catText: {
    fontSize: 14,
    fontWeight: "700",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  input: {
    height: 55,
    borderRadius: 18,
    marginBottom: 30,
  },
  submitBtn: {
    height: 60,
    borderRadius: 20,
  },
  successContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  successSub: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
