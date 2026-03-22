import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";

export interface ReviewData {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PublicProfileData {
  id: string;
  name: string;
  handle: string;
  description: string;
  skills: string[];
  contact: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  recentReviews?: ReviewData[];
}

interface PublicProfileViewProps {
  isDesktop: boolean;
  profile: PublicProfileData;
  onBack: () => void;
  onChat: (profileId: string) => void;
}

export default function PublicProfileView({ isDesktop, profile, onBack, onChat }: PublicProfileViewProps) {
  const { colors } = useTheme();

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
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {profile.rating || 5.0} <Text style={{ color: colors.mutedText }}>({profile.reviewsCount || 0} reviews)</Text>
                </Text>
              </View>
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

        {/* Recent Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reviews</Text>
            {profile.reviewsCount && profile.reviewsCount > 3 && (
                <TouchableOpacity>
                   <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.reviewsList}>
            {profile.recentReviews && profile.recentReviews.length > 0 ? (
                profile.recentReviews.map((review) => (
                    <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.iconBackground }]}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewAuthorInfo}>
                                <Text style={[styles.reviewAuthor, { color: colors.text }]}>{review.authorName}</Text>
                                <View style={styles.reviewRatingRow}>
                                    {[...Array(5)].map((_, i) => (
                                        <Ionicons 
                                            key={i} 
                                            name={i < review.rating ? "star" : "star-outline"} 
                                            size={12} 
                                            color={i < review.rating ? "#FFD700" : colors.mutedText} 
                                        />
                                    ))}
                                </View>
                            </View>
                            <Text style={[styles.reviewDate, { color: colors.mutedText }]}>{review.date}</Text>
                        </View>
                        <Text style={[styles.reviewComment, { color: colors.secondaryText }]}>{review.comment}</Text>
                    </View>
                ))
            ) : (
                <View style={[styles.emptyReviews, { borderColor: colors.border }]}>
                    <Text style={[styles.emptyReviewsText, { color: colors.mutedText }]}>No reviews yet. Be the first to leave one!</Text>
                </View>
            )}
          </View>
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
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
    elevation: 5,
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
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
  },
  reviewsList: {
    gap: 15,
  },
  reviewCard: {
    padding: 20,
    borderRadius: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  reviewAuthorInfo: {
    gap: 4,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: "700",
  },
  reviewRatingRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  emptyReviews: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyReviewsText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
