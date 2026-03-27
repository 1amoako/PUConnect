import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
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
  onSave?: (data: any) => void;
  initialData?: {
    name: string;
    handle: string;
    description: string;
    skills: string[];
    contact: string;
    expertStatus: 'none' | 'pending' | 'approved';
  };
}

export default function ProfileEditorView({ isDesktop, onBack, onSave, initialData }: ProfileEditorViewProps) {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [handle, setHandle] = useState(initialData?.handle || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [contact, setContact] = useState(initialData?.contact || "");
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  
  const isAlreadyExpert = initialData?.expertStatus === 'approved' || initialData?.expertStatus === 'pending';
  const [isExpertExpanded, setIsExpertExpanded] = useState(isAlreadyExpert);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      // Material You style bouncing dots animation
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animateDot(dot1Anim, 0);
      animateDot(dot2Anim, 150);
      animateDot(dot3Anim, 300);
    } else {
      // Stop all animations
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
    }
  }, [isLoading, dot1Anim, dot2Anim, dot3Anim]);

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
    setErrorMessage("");
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setErrorMessage("");

    // Simulate submission process
    setTimeout(() => {
      setIsLoading(false);
      const submission = { 
        name, 
        handle, 
        description, 
        skills, 
        contact,
        isExpertActive: isExpertExpanded 
      };
      
      onSave?.(submission);
      setIsSubmitted(true);
    }, 1600);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
        </View>
        <Text style={[styles.successTitle, { color: colors.text, marginTop: 18 }]}>Submitting your profile...</Text>
        <Text style={[styles.successDescription, { color: colors.mutedText }]}>Please wait while we save your details.</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.background }]}> 
        <Ionicons name="alert-circle" size={80} color={colors.danger} />
        <Text style={[styles.successTitle, { color: colors.text, marginTop: 18 }]}>Submission Failed</Text>
        <Text style={[styles.successDescription, { color: colors.mutedText }]}>{errorMessage}</Text>
        <GlassButton title="Try Again" onPress={handleInitialSubmit} style={styles.successButton} />
        <GlassButton title="Cancel" variant="secondary" onPress={onBack} style={styles.successButton} />
      </View>
    );
  }

  if (isSubmitted) {
    const isNewApplication = isExpertExpanded && !isAlreadyExpert;
    return (
      <View style={[styles.container, styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successIconContainer, { backgroundColor: 
          isNewApplication ? colors.iconBackground : colors.primary + '1A'
        }]}>
          <Ionicons 
            name={isNewApplication ? 'time-outline' : 'checkmark-circle-outline'} 
            size={80} 
            color={colors.primary} 
          />
        </View>
        <Text style={[styles.successTitle, { color: colors.text }]}>
          {isNewApplication ? "Application Submitted!" : "Profile Updated!"}
        </Text>
        <Text style={[styles.successDescription, { color: colors.mutedText }]}>
          {isNewApplication 
            ? "Your expert profile application is awaiting admin review. You'll be notified once approved."
            : "Your profile information has been successfully updated."}
        </Text>
        <GlassButton 
          title="Done" 
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
          {!isDesktop && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <GlassContainer style={[styles.modularSection, { borderColor: colors.border }]}>
          <View style={styles.sectionHeaderInner}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.sectionTitleModular, { color: colors.text }]}>Identity Profile</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>How you appear on the platform</Text>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Full Name</Text>
            <GlassTextInput
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              containerStyle={styles.modularInputContainer}
              style={styles.modularInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Handle</Text>
            <GlassTextInput
              placeholder="@username"
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
              containerStyle={styles.modularInputContainer}
              style={styles.modularInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Contact Information</Text>
            <GlassTextInput
              placeholder="Email or Phone Number"
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
              containerStyle={styles.modularInputContainer}
              style={styles.modularInput}
            />
          </View>
        </GlassContainer>


        <GlassContainer style={[styles.modularSection, { borderColor: colors.border, marginTop: 25 }]}>
          <View style={styles.sectionHeaderInner}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.sectionTitleModular, { color: colors.text }]}>Skill Profile</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Your expertise and professional bio</Text>
            </View>
          </View>

          {!isExpertExpanded ? (
            <TouchableOpacity 
              style={[styles.upgradeToggleModular, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }]}
              onPress={() => setIsExpertExpanded(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.upgradeIconSmall, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="sparkles-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.upgradeTextContainer}>
                <Text style={[styles.upgradeToggleTitle, { color: colors.text }]}>Become an Expert</Text>
                <Text style={[styles.upgradeToggleDesc, { color: colors.mutedText }]}>Showcase skills and attract more service requests</Text>
              </View>
              <View style={[styles.plusCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={24} color={colors.background} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.expertContent}>
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Expert Overview</Text>
                  {!isAlreadyExpert && (
                    <TouchableOpacity onPress={() => setIsExpertExpanded(false)}>
                      <Text style={[styles.removeLink, { color: colors.danger }]}>Disable</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[
                    styles.textAreaModular,
                    {
                      color: colors.text,
                      backgroundColor: colors.iconBackground,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Share what makes you an expert in your field..."
                  placeholderTextColor={colors.mutedText}
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Core Skills</Text>
                <View style={[styles.skillInputRow, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
                  <GlassTextInput
                    placeholder="Add skill (e.g. Design)"
                    value={newSkill}
                    onChangeText={setNewSkill}
                    containerStyle={styles.skillInputBar}
                    style={styles.skillInputInner}
                  />
                  <TouchableOpacity
                    style={[styles.addBtnIntegrated, { backgroundColor: colors.primary }]}
                    onPress={addSkill}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={24} color={colors.background} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.skillsFlow}>
                  {skills.length > 0 ? skills.map((skill) => (
                    <View
                      key={skill}
                      style={[styles.skillChip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}
                    >
                      <Text style={[styles.skillChipText, { color: colors.text }]}>{skill}</Text>
                      <TouchableOpacity onPress={() => removeSkill(skill)}>
                        <Ionicons name="close-circle" size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  )) : (
                    <View style={styles.emptySkillsContainer}>
                        <Ionicons name="construct-outline" size={24} color={colors.mutedText + '40'} />
                        <Text style={[styles.emptySkillsHint, { color: colors.mutedText }]}>No skills added yet</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </GlassContainer>


        <View style={styles.footerModular}>
          <GlassButton
            title="Save Profile"
            onPress={handleInitialSubmit}
            style={styles.saveButtonModular}
          />
          {!isDesktop && (
            <GlassButton
              title="Cancel"
              variant="secondary"
              onPress={onBack}
              style={styles.cancelButtonModular}
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Save Profile Changes?
            </Text>
            <Text style={[styles.modalDescription, { color: colors.mutedText }]}>
              {(!isAlreadyExpert && isExpertExpanded) 
                ? 'Your identity will be updated and your expert application will be sent for review.'
                : 'All changes to your identity and professional profile will be saved.'}
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
    justifyContent: "space-between",
    marginBottom: 35,
    marginTop: Platform.OS === 'web' ? 0 : 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  closeButtonDesktop: {
    padding: 8,
    marginRight: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  modularSection: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
  },
  sectionHeaderInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleModular: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 1,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  modularInputContainer: {
    marginVertical: 0,
  },
  modularInput: {
    height: 54,
    borderRadius: 16,
    fontSize: 16,
  },
  upgradeToggleModular: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: "dashed",
    gap: 16,
  },
  upgradeIconSmall: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeToggleTitle: {
    fontSize: 17,
    fontWeight: "900",
  },
  upgradeToggleDesc: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  plusCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
  },
  expertContent: {
    marginTop: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  removeLink: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textAreaModular: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    lineHeight: 24,
  },
  skillInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 4,
    paddingLeft: 4,
    height: 60,
  },
  skillInputBar: {
    flex: 1,
    marginVertical: 0,
  },
  skillInputInner: {
    height: 50,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  addBtnIntegrated: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  skillsFlow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 10,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    gap: 10,
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  emptySkillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  emptySkillsHint: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerModular: {
    marginTop: 40,
    gap: 15,
  },
  saveButtonModular: {
    width: "100%",
  },
  cancelButtonModular: {
    width: "100%",
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
  },  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 40,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },  successTitle: {
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
