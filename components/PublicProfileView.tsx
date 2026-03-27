import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import ReviewSection from "./ReviewSection";

export interface PublicProfileData {
  id: string;
  name: string;
  handle: string;
  description: string;
  skills: string[];
  contact: string;
  image?: string;
}

interface PublicProfileViewProps {
  isDesktop: boolean;
  profile: PublicProfileData;
  onBack: () => void;
  onChat: (profileId: string) => void;
}

export default function PublicProfileView({ isDesktop, profile, onBack, onChat }: PublicProfileViewProps) {
  const { colors } = useTheme();
  const [isViewingAllReviews, setIsViewingAllReviews] = useState(false);

  if (isViewingAllReviews) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <View style={[styles.allReviewsHeader, { borderBottomColor: colors.border }]}>
            {isDesktop && (
              <TouchableOpacity onPress={() => setIsViewingAllReviews(false)} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            <Text style={[styles.allReviewsTitle, { color: colors.text }]}>
               Reviews
            </Text>
         </View>
         <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}>
             <ReviewSection providerName={profile.name} hasCompletedService={profile.id === "1"} hideTitle={true} />
         </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.imageContainer, { borderColor: colors.primary }]}>
              {profile.image ? (
                <Image source={{ uri: profile.image }} style={styles.profileImage} />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: colors.iconBackground }]}>
                  <Ionicons name="person" size={50} color={colors.primary} />
                </View>
              )}
            </View>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
              <Text style={[styles.handle, { color: colors.mutedText }]}>@{profile.handle}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <GlassButton 
              title={`Chat with ${profile.name.split(' ')[0]}`} 
              icon="chatbubble-ellipses-outline"
              onPress={() => onChat(profile.id)}
              style={styles.chatButton}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            {profile.description}
          </Text>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, index) => (
              <View key={index} style={[styles.skillBadge, { backgroundColor: colors.iconBackground }]}>
                <Text style={[styles.skillText, { color: colors.primary }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Public Contact</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.iconBackground }]}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={[styles.contactText, { color: colors.text }]}>{profile.contact}</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <ReviewSection 
            providerName={profile.name} 
            hasCompletedService={profile.id === "1"} 
            limit={3}
            onViewAll={() => setIsViewingAllReviews(true)}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  allReviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  allReviewsTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  desktopContent: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    paddingTop: 30,
  },
  headerCard: {
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 30,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.05)",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 25,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    padding: 3,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  handle: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionRow: {
    width: "100%",
  },
  chatButton: {
    width: "100%",
  },
  section: {
    marginBottom: 35,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "500",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  skillText: {
    fontSize: 14,
    fontWeight: "700",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
    borderRadius: 18,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
