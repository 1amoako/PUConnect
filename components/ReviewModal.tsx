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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRating = (value: number) => {
    setRating(value);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
        setError("Please select a star rating");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
        // Simulate a real API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Randomly simulate an error for demonstration (1 in 10 chance)
        // if (Math.random() < 0.1) throw new Error("Connection lost");

        setIsSubmitted(true);
        onSubmit(rating, comment);
        
        // Wait another second to show success before closing, or let the user close it
        // For now, we'll let the user click "Done" in the success view
    } catch {
        setError("Something went wrong. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setRating(0);
    setComment("");
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
        <View style={styles.overlay}>
          {/* Only the backdrop is touchable to dismiss */}
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}>
            <Animated.View 
                entering={FadeIn} 
                exiting={FadeOut} 
                style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.6)' }]} 
            />
          </TouchableWithoutFeedback>

          <Animated.View 
            entering={ZoomIn} 
            exiting={ZoomOut} 
            style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            {isSubmitted ? (
                <View style={styles.successContainer}>
                    <View style={[styles.successIconCircle, { backgroundColor: colors.primary + '1A' }]}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Review Sent!</Text>
                    <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                        Thank you for your feedback. It helps {providerName} grow their profile.
                    </Text>
                    <GlassButton 
                        title="Done" 
                        onPress={resetAndClose} 
                        style={styles.doneButton}
                    />
                </View>
            ) : (
                <>
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
                            disabled={isLoading}
                        >
                            <Ionicons 
                            name={star <= rating ? "star" : "star-outline"} 
                            size={42} 
                            color={star <= rating ? "#FFD700" : colors.mutedText} 
                            />
                        </TouchableOpacity>
                        ))}
                    </View>

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                        style={[styles.textInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.iconBackground }]}
                        placeholder="Write a comment (optional)..."
                        placeholderTextColor={colors.mutedText}
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                        editable={!isLoading}
                        autoFocus={false}
                        />
                    </View>

                    <View style={styles.actions}>
                        {!isLoading && (
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={[styles.cancelText, { color: colors.mutedText }]}>Skip</Text>
                        </TouchableOpacity>
                        )}
                        <GlassButton 
                        title={isLoading ? "Submitting..." : "Submit Review"} 
                        onPress={handleSubmit} 
                        style={styles.submitButton}
                        disabled={rating === 0 || isLoading}
                        />
                    </View>
                </>
            )}
          </Animated.View>
        </View>
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
  errorText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
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
  successContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  doneButton: {
    width: "100%",
    marginTop: 20,
  },
});
