import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";

export type ReportCategory = "Spam" | "Harassment" | "Scam" | "Inappropriate" | "Other";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetName: string;
  isDesktop?: boolean;
}

export function ReportModal({ visible, onClose, targetName, isDesktop }: ReportModalProps) {
  const { colors, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const categories: ReportCategory[] = ["Spam", "Harassment", "Scam", "Inappropriate", "Other"];

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedCategory(null);
      setDescription("");
      setStatus("idle");
    }, 300); // Reset state after transition
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;
    
    setStatus("loading");
    
    // Simulate submission flow
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        handleClose();
      }, 2000); // Close automatically after showing success
    }, 1500);
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
          <Text style={[styles.statusTitle, { color: colors.text }]}>Submitting Report...</Text>
        </View>
      );
    }

    if (status === "success") {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#34C759" />
          <Text style={[styles.statusTitle, { color: colors.text }]}>Report Submitted</Text>
          <Text style={[styles.statusSub, { color: colors.mutedText }]}>
            Thank you for helping keep the community safe. Our moderation team will review this shortly.
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Report {targetName}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>
          Please select a reason for reporting this user.
        </Text>

        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === cat ? colors.primary : colors.iconBackground },
                selectedCategory === cat && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  { color: selectedCategory === cat ? colors.background : colors.text }
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              borderColor: colors.border,
              color: colors.text
            }
          ]}
          placeholder="Additional details (optional)..."
          placeholderTextColor={colors.mutedText}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.footer}>
          <GlassButton
            title="Cancel"
            variant="secondary"
            onPress={handleClose}
            style={styles.actionBtn}
          />
          <GlassButton
            title="Submit Report"
            onPress={handleSubmit}
            disabled={!selectedCategory}
            style={[styles.actionBtn, { backgroundColor: '#FF3B30', borderColor: '#FF3B30' }]}
          />
        </View>
      </>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <GlassContainer style={[
           styles.modalContainer, 
           isDesktop && styles.modalContainerDesktop,
           { backgroundColor: colors.cardBackground, borderColor: colors.border }
        ]}>
          {renderContent()}
        </GlassContainer>
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
  modalContainer: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
  },
  modalContainerDesktop: {
    maxWidth: 500,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryChipSelected: {
    boxShadow: "0 4 12 rgba(0,0,0,0.2)",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 54,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
  },
  statusSub: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
