import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";
import { GlassTextInput } from "./GlassTextInput";

interface ProfileEditorViewProps {
  isDesktop: boolean;
  onBack: () => void;
  initialData?: {
    name: string;
    handle: string;
    description: string;
    skills: string[];
    contact: string;
  };
}

export default function ProfileEditorView({ isDesktop, onBack, initialData }: ProfileEditorViewProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [handle, setHandle] = useState(initialData?.handle || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [contact, setContact] = useState(initialData?.contact || "");
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleInitialSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    // Simulate submission process
    console.log("Submitting profile for review:", { name, handle, description, skills, contact });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successIconContainer, { backgroundColor: colors.iconBackground }]}>
          <Ionicons name="time-outline" size={80} color={colors.primary} />
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>Application Submitted!</Text>
        <Text style={[styles.successDescription, { color: colors.mutedText }]}>
          Your profile has been successfully submitted for review. An admin will check your details before it is activated. This usually takes less than 24 hours.
        </Text>
        <GlassButton 
          title="OK" 
          onPress={onBack} 
          style={styles.successButton}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {initialData ? "Update Your Profile" : "Create Your Profile"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>Basic Info</Text>
          <GlassTextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <GlassTextInput
            placeholder="Handle (e.g. @username)"
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>About You</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                color: colors.text,
                backgroundColor: colors.cardBackground,
                borderColor: colors.primary,
              },
            ]}
            placeholder="Brief description about yourself and what you do..."
            placeholderTextColor={colors.mutedText}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>Skills</Text>
          <View style={styles.skillInputContainer}>
            <GlassTextInput
              placeholder="Add a skill (e.g. Graphic Design)"
              value={newSkill}
              onChangeText={setNewSkill}
              style={styles.skillInput}
            />
            <TouchableOpacity
              style={[styles.addSkillButton, { backgroundColor: colors.primary }]}
              onPress={addSkill}
            >
              <Ionicons name="add" size={24} color={colors.background} />
            </TouchableOpacity>
          </View>
          <View style={styles.skillsList}>
            {skills.map((skill) => (
              <View
                key={skill}
                style={[styles.skillBadge, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}
              >
                <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                <TouchableOpacity onPress={() => removeSkill(skill)}>
                  <Ionicons name="close-circle" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>Contact Info</Text>
          <GlassTextInput
            placeholder="Email or Phone Number"
            value={contact}
            onChangeText={setContact}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.footer}>
          <GlassButton
            title={initialData ? "Save Changes" : "Create Profile"}
            onPress={handleInitialSubmit}
            style={styles.saveButton}
          />
          {isDesktop && (
            <GlassButton
              title="Cancel"
              variant="secondary"
              onPress={onBack}
              style={styles.cancelButton}
            />
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} 
          activeOpacity={1} 
          onPress={() => setShowConfirmModal(false)}
        >
          <GlassContainer style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="help-circle-outline" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Confirm</Text>
            <Text style={[styles.modalDescription, { color: colors.mutedText }]}>
              Are you sure you want to create your profile with these information?
            </Text>
            
            <View style={styles.modalButtons}>
              <GlassButton 
                title="Cancel" 
                variant="secondary" 
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalButton}
              />
              <GlassButton 
                title="Confirm" 
                onPress={handleConfirmSubmit}
                style={styles.modalButton}
              />
            </View>
          </GlassContainer>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scrollContentDesktop: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
  },
  skillInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skillInput: {
    flex: 1,
    marginVertical: 0,
  },
  addSkillButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    gap: 10,
  },
  skillBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  skillText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 15,
  },
  saveButton: {
    flex: 2,
  },
  cancelButton: {
    flex: 1,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
  },
  successDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  successButton: {
    width: "100%",
    maxWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },
  modalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
