import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { 
    Modal, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Image,
    ActivityIndicator
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";
import { GlassTextInput } from "./GlassTextInput";

interface AdEditorModalProps {
  isVisible: boolean;
  isDesktop: boolean;
  type: 'skill' | 'request';
  onBack: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
}

export default function AdEditorModal({ isVisible, isDesktop, type, onBack, onSave, initialData }: AdEditorModalProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = type === 'skill' ? 3 : 1;

  useEffect(() => {
    if (isVisible) {
      setStep(1);
      setIsLoading(false);
      if (!initialData) {
        setTitle("");
        setDescription("");
        setPrice("");
        setImage("");
      }
    }
  }, [isVisible, initialData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSave();
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      onSave?.({
        title,
        description,
        price,
        image,
        type,
        status: 'pending'
      });
      setIsLoading(false);
    }, 1500);
  };

  const renderStepIndicator = () => {
    if (totalSteps === 1) return <View style={{ width: 40 }} />; // Maintain header balance
    return (
      <View style={styles.indicatorContainer}>
        {[1, 2, 3].map((s) => (
        <View 
          key={s} 
          style={[
            styles.indicatorDot, 
            { backgroundColor: step >= s ? colors.primary : colors.iconBackground }
          ]} 
        />
      ))}
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onBack}>
      <View style={styles.overlay}>
        <GlassContainer style={[styles.modalBox, isDesktop && styles.modalBoxDesktop, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name={step === 1 ? "close" : "arrow-back"} size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              {initialData ? 'Edit' : 'Create'} {type === 'skill' ? 'Skill Ad' : 'Service Request'}
            </Text>
            {renderStepIndicator()}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {type === 'skill' ? 'The Basics' : 'Request Details'}
                </Text>
                <Text style={[styles.sectionDesc, { color: colors.mutedText }]}>
                  {type === 'skill' 
                    ? 'Give your ad a catchy title.' 
                    : 'What service do you need help with?'}
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedText }]}>Title</Text>
                  <GlassTextInput 
                    placeholder={type === 'skill' ? "e.g. Website Development" : "e.g. Need help with React Native"} 
                    value={title} 
                    onChangeText={setTitle} 
                    style={styles.input}
                  />
                </View>

                {type === 'request' && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.mutedText }]}>Description</Text>
                    <TextInput
                      style={[styles.textArea, { height: 260, backgroundColor: colors.iconBackground, color: colors.text, borderColor: colors.border }]}
                      placeholder="Explain what you need in detail..."
                      placeholderTextColor={colors.mutedText}
                      multiline
                      numberOfLines={8}
                      value={description}
                      onChangeText={setDescription}
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </View>
            )}

            {step === 2 && type === 'skill' && (
              <View style={styles.stepContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                <Text style={[styles.sectionDesc, { color: colors.mutedText }]}>Explain what you offer in detail.</Text>
                
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.iconBackground, color: colors.text, borderColor: colors.border }]}
                  placeholder="Details..."
                  placeholderTextColor={colors.mutedText}
                  multiline
                  numberOfLines={6}
                  value={description}
                  onChangeText={setDescription}
                  textAlignVertical="top"
                />
              </View>
            )}

            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Visuals</Text>
                <Text style={[styles.sectionDesc, { color: colors.mutedText }]}>Add a cover image to stand out.</Text>
                
                <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { borderColor: colors.border, backgroundColor: colors.iconBackground }]}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.pickerPlaceholder}>
                      <Ionicons name="image-outline" size={48} color={colors.mutedText} />
                      <Text style={[styles.pickerText, { color: colors.mutedText }]}>Tap to select image</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <GlassButton 
              title={isLoading ? "" : (step === totalSteps 
                ? (initialData ? "Save Changes" : (type === 'skill' ? "Publish Now" : "Post Request")) 
                : "Next Step")
              } 
              onPress={handleNext} 
              style={styles.actionBtn}
              disabled={isLoading}
            >
              {isLoading && <ActivityIndicator color={colors.background} />}
            </GlassButton>
          </View>
        </GlassContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    height: '85%',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
  },
  modalBoxDesktop: {
    width: 600,
    height: 700,
    borderRadius: 32,
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stepContainer: {
    animationDuration: '0.3s',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
  },
  textArea: {
    height: 200,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    fontSize: 16,
    lineHeight: 24,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  pickerPlaceholder: {
    alignItems: 'center',
    gap: 10,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
  },
  actionBtn: {
    width: '100%',
    height: 56,
  },
});
