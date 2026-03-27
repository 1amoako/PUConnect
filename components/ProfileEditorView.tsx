import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { 
    Animated, 
    Easing, 
    Image, 
    Modal, 
    Platform, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";
import { GlassTextInput } from "./GlassTextInput";

interface ProfileEditorViewProps {
  isVisible: boolean;
  isDesktop: boolean;
  mode: 'identity' | 'expert' | 'both';
  onBack: () => void;
  onSave?: (data: any) => void;
  initialData?: {
    name: string;
    handle: string;
    description: string;
    skills: string[];
    contact: string;
    avatar?: string;
    expertStatus: 'none' | 'pending' | 'approved';
  };
}

export default function ProfileEditorView({ isVisible, isDesktop, mode, onBack, onSave, initialData }: ProfileEditorViewProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [handle, setHandle] = useState(initialData?.handle || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [contact, setContact] = useState(initialData?.contact || "");
  const [avatar, setAvatar] = useState(initialData?.avatar || "");
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  
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
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
    }
  }, [isLoading]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    setErrorMessage("");
    setShowConfirmModal(true);
  };

  const handleFinalSave = () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsLoading(false);
      const submission = { 
        name, 
        handle, 
        description, 
        skills, 
        contact,
        avatar,
        isExpertActive: isExpertExpanded 
      };
      
      onSave?.(submission);
      setIsSubmitted(true);
    }, 1600);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBack}
    >
      <View style={styles.modalOverlay}>
        <GlassContainer style={[
          styles.modalContent, 
          isDesktop && styles.modalContentDesktop,
          { backgroundColor: colors.background, borderColor: colors.border }
        ]}>
          {isLoading ? (
            <View style={styles.stateContainer}>
              <View style={styles.loadingContainer}>
                <Animated.View style={[styles.loadingDot, { backgroundColor: colors.primary, transform: [{ translateY: dot1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }] }]} />
                <Animated.View style={[styles.loadingDot, { backgroundColor: colors.primary, transform: [{ translateY: dot2Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }] }]} />
                <Animated.View style={[styles.loadingDot, { backgroundColor: colors.primary, transform: [{ translateY: dot3Anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }] }]} />
              </View>
              <Text style={[styles.stateTitle, { color: colors.text }]}>Submitting Changes...</Text>
              <Text style={[styles.stateDescription, { color: colors.mutedText }]}>Please wait while we update your profile.</Text>
            </View>
          ) : errorMessage ? (
            <View style={styles.stateContainer}>
              <View style={[styles.stateIconCircle, { backgroundColor: colors.danger + '15' }]}>
                <Ionicons name="alert-circle" size={48} color={colors.danger} />
              </View>
              <Text style={[styles.stateTitle, { color: colors.text }]}>Submission Failed</Text>
              <Text style={[styles.stateDescription, { color: colors.mutedText }]}>{errorMessage}</Text>
              <View style={styles.stateActions}>
                <GlassButton title="Try Again" onPress={handleSave} style={styles.stateActionBtn} />
                <TouchableOpacity onPress={onBack} style={styles.stateSecondaryBtn}>
                  <Text style={[styles.stateSecondaryText, { color: colors.mutedText }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : isSubmitted ? (
            <View style={styles.stateContainer}>
              <View style={[styles.stateIconCircle, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons 
                  name={isExpertExpanded && !isAlreadyExpert ? 'time-outline' : 'checkmark-circle-outline'} 
                  size={48} 
                  color={colors.primary} 
                />
              </View>
              <Text style={[styles.stateTitle, { color: colors.text }]}>
                {isExpertExpanded && !isAlreadyExpert ? "Application Received!" : "Profile Updated!"}
              </Text>
              <Text style={[styles.stateDescription, { color: colors.mutedText }]}>
                {isExpertExpanded && !isAlreadyExpert 
                  ? "Your expert profile application is awaiting review. We'll notify you soon."
                  : "Your changes have been successfully saved to your profile."}
              </Text>
              <GlassButton 
                title="Back to Feed" 
                onPress={onBack} 
                style={styles.stateActionBtn}
              />
            </View>
          ) : (
            <>
              <View style={styles.modalHeader}>
                <View style={styles.headerLeft}>
                  <View style={[styles.headerIconBox, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons 
                      name={mode === 'identity' ? "person-outline" : mode === 'expert' ? "ribbon-outline" : "settings-outline"} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {mode === 'identity' ? "Identity Profile" : mode === 'expert' ? "Expert Profile" : "Edit Profile"}
                    </Text>
                    <Text style={[styles.modalSubtitle, { color: colors.mutedText }]}>
                      {mode === 'identity' ? "Update personal info" : mode === 'expert' ? "Manage skills" : "Update account settings"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onBack} style={[styles.closeBtn, { backgroundColor: colors.iconBackground }]}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
               {(mode === 'identity' || mode === 'both') && (
                <View style={styles.editorSection}>
                  {!isDesktop && mode === 'both' && (
                    <Text style={[styles.mobileSectionLabel, { color: colors.mutedText }]}>IDENTITY PROFILE</Text>
                  )}
                  
                  <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                      {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                      ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.avatarPlaceholderText, { color: colors.background }]}>
                            {name ? name.charAt(0).toUpperCase() : "?"}
                          </Text>
                        </View>
                      )}
                      <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="camera" size={16} color={colors.background} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Full Name</Text>
                    <GlassTextInput placeholder="e.g. Jacob Zero" value={name} onChangeText={setName} style={styles.modularInput} />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Handle</Text>
                    <GlassTextInput placeholder="e.g. @jacobzero" value={handle} onChangeText={setHandle} style={styles.modularInput} autoCapitalize="none" />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Contact Info</Text>
                    <GlassTextInput placeholder="Phone or email" value={contact} onChangeText={setContact} style={styles.modularInput} />
                  </View>
                </View>
               )}

               {mode === 'both' && <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />}

               {(mode === 'expert' || mode === 'both') && (
                <View style={styles.editorSection}>
                  {!isAlreadyExpert && (
                    <View style={[styles.expertIncentive, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }]}>
                      <Ionicons name="sparkles" size={24} color={colors.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.incentiveTitle, { color: colors.text }]}>Unlock Expert Features</Text>
                        <Text style={[styles.incentiveText, { color: colors.mutedText }]}>Reach more users with specialized skills.</Text>
                      </View>
                      {!isAlreadyExpert && mode === 'both' && (
                        <TouchableOpacity 
                          onPress={() => setIsExpertExpanded(!isExpertExpanded)}
                          style={[styles.miniToggle, { backgroundColor: isExpertExpanded ? colors.primary : colors.iconBackground }]}
                        >
                          <View style={[styles.miniToggleCircle, { backgroundColor: isExpertExpanded ? '#fff' : colors.mutedText, transform: [{ translateX: isExpertExpanded ? 16 : 2 }] }]} />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {(isExpertExpanded || mode === 'expert') && (
                    <Animated.View style={{ opacity: 1, marginTop: 15 }}>
                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Skill Bio</Text>
                        <TextInput
                          style={[styles.textArea, { backgroundColor: colors.iconBackground, color: colors.text, borderColor: colors.border }]}
                          placeholder="Brief description of your skills..."
                          placeholderTextColor={colors.mutedText}
                          multiline
                          numberOfLines={4}
                          value={description}
                          onChangeText={setDescription}
                          textAlignVertical="top"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.mutedText }]}>Skills & Specialties</Text>
                        <View style={[styles.integratedSkillBar, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
                          <TextInput style={[styles.skillInputPart, { color: colors.text }]} placeholder="Add a skill" placeholderTextColor={colors.mutedText} value={newSkill} onChangeText={setNewSkill} onSubmitEditing={handleAddSkill} />
                          <TouchableOpacity onPress={handleAddSkill} style={[styles.addSkillBtnPart, { backgroundColor: colors.primary }]}>
                            <Ionicons name="add" size={24} color={colors.background} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.skillsList}>
                          {skills.map((skill, index) => (
                            <View key={index} style={[styles.skillChip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '33' }]}>
                              <Text style={[styles.skillChipText, { color: colors.primary }]}>{skill}</Text>
                              <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                                <Ionicons name="close-circle" size={18} color={colors.primary} />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
               )}
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <View style={styles.footerBtns}>
                  <TouchableOpacity onPress={onBack} style={[styles.secondaryActionBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.secondaryActionText, { color: colors.mutedText }]}>Discard</Text>
                  </TouchableOpacity>
                  <GlassButton title="Save Changes" onPress={handleSave} style={styles.primaryActionBtn} />
                </View>
              </View>
            </>
          )}
        </GlassContainer>
      </View>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: colors.background }]}>
            <Text style={[styles.confirmTitle, { color: colors.text }]}>Save Changes?</Text>
            <Text style={[styles.confirmDesc, { color: colors.mutedText }]}>Update your profile information?</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={styles.confirmBack}>
                <Text style={[styles.confirmBackText, { color: colors.mutedText }]}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFinalSave} style={[styles.confirmSave, { backgroundColor: colors.primary }]}>
                <Text style={styles.confirmSaveText}>Yes, Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalContentDesktop: {
    width: 600,
    borderRadius: 32,
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  stateContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  stateDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  stateActions: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  stateActionBtn: {
    width: '100%',
    maxWidth: 240,
  },
  stateSecondaryBtn: {
    paddingVertical: 10,
  },
  stateSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
  },
  editorSection: {
    marginBottom: 10,
  },
  mobileSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 20,
    opacity: 0.6,
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    marginVertical: 30,
    opacity: 0.2,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 40,
    fontWeight: "800",
  },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  modularInput: {
    height: 54,
    borderRadius: 16,
    fontSize: 16,
  },
  expertIncentive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  incentiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  incentiveText: {
    fontSize: 13,
    lineHeight: 18,
  },
  miniToggle: {
    width: 40,
    height: 22,
    borderRadius: 12,
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  miniToggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  textArea: {
    height: 120,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  integratedSkillBar: {
    flexDirection: "row",
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  skillInputPart: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  addSkillBtnPart: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 15,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  modalFooter: {
    paddingVertical: 24,
    borderTopWidth: 1,
    marginTop: 10,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 15,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryActionBtn: {
    flex: 2,
    height: 56,
    borderRadius: 18,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmBox: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 32,
    padding: 30,
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  confirmDesc: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  confirmRow: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  confirmBack: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmBackText: {
    fontWeight: "700",
  },
  confirmSave: {
    flex: 1.5,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },
  confirmSaveText: {
    color: "#fff",
    fontWeight: "800",
  },
  loadingContainer: {
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
  },
});
