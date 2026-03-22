import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  providerName: string;
}

export default function ReviewModal({ isVisible, onClose, onSubmit, providerName }: ReviewModalProps) {
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut} 
            style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
          />
          <Animated.View 
            entering={ZoomIn} 
            exiting={ZoomOut} 
            style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Rate your experience</Text>
              <Text style={[styles.subtitle, { color: colors.mutedText }]}>How was your service with {providerName}?</Text>
            </View>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => handleRating(star)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={star <= rating ? "star" : "star-outline"} 
                    size={42} 
                    color={star <= rating ? "#FFD700" : colors.mutedText} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.iconBackground }]}
                placeholder="Write a comment (optional)..."
                placeholderTextColor={colors.mutedText}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={[styles.cancelText, { color: colors.mutedText }]}>Skip</Text>
              </TouchableOpacity>
              <GlassButton 
                title="Submit Review" 
                onPress={handleSubmit} 
                style={styles.submitButton}
                disabled={rating === 0}
              />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    boxShadow: "0px 15px 40px rgba(0,0,0,0.2)",
    elevation: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 25,
  },
  textInput: {
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },
  cancelButton: {
    paddingHorizontal: 15,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
  },
  submitButton: {
    flex: 1,
    marginVertical: 0,
  },
});
