import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import ContentCard from "./ContentCard";

import { UserProfile } from "../app/feed";

interface ProfileViewProps {
  isDesktop: boolean;
  user: UserProfile;
  onEdit: (mode?: 'identity' | 'expert' | 'both') => void;
  onDeleteAd?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
  onCreateAd?: () => void;
  onCreateRequest?: () => void;
  onEditAd?: (ad: any) => void;
  onEditRequest?: (req: any) => void;
}

// Static constants removed

export default function ProfileView({ 
  isDesktop, user, onEdit, onDeleteAd, onDeleteRequest, onCreateAd, onCreateRequest, onEditAd, onEditRequest 
}: ProfileViewProps) {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "requests">("profile");

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const fabStyle = useAnimatedStyle(() => {
    // Show FAB when scrolled past the profile card (~180px) AND not on the main profile tab
    const isVisible = scrollY.value > 180 && activeTab !== "profile";
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        { scale: withSpring(isVisible ? 1 : 0) },
        { translateY: withSpring(isVisible ? 0 : 20) }
      ],
    };
  });

  const initial = user.name.charAt(0).toUpperCase();

  // Temporary mock activities (will be moved later)
  const activities = [
    { id: "1", type: "skill", icon: "code-slash-outline", text: "Added Next.js to skills", time: "2 hours ago" },
    { id: "2", type: "connection", icon: "people-outline", text: "Connected with Alice Cooper", time: "1 day ago" },
    { id: "3", type: "system", icon: "rocket-outline", text: "Joined PUConnect", time: "3 days ago" },
  ];

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: isDesktop ? 140 : 180 }
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
      {/* Profile Card */}
      <View style={[styles.profileCard, isDesktop && styles.profileCardDesktop, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.background }]}>{initial}</Text>
          </View>
          {/* Expert Status Badge */}
          {user.expertStatus === 'approved' && (
            <View style={[styles.avatarBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="star" size={10} color={isDark ? '#000' : '#fff'} />
            </View>
          )}
          {user.expertStatus === 'pending' && (
            <View style={[styles.avatarBadge, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="time-outline" size={10} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userHandle, { color: colors.mutedText }]}>{user.handle}</Text>
          <Text style={[styles.userJoined, { color: colors.mutedText }]}>Joined {user.joined}</Text>
          {/* Role Pill */}
          <View style={[styles.rolePill, { 
            backgroundColor: user.expertStatus === 'approved' ? colors.primary + '1A' : colors.iconBackground,
            borderColor: user.expertStatus === 'approved' ? colors.primary : colors.border
          }]}>
            <Text style={[styles.rolePillText, { 
              color: user.expertStatus === 'approved' ? colors.primary : colors.mutedText 
            }]}>
              {user.expertStatus === 'approved' ? '⭐ Verified Expert' : user.expertStatus === 'pending' ? '⏳ Pending Review' : 'Community Member'}
            </Text>
          </View>

          {user.expertStatus === 'pending' && (
            <View style={[styles.pendingBanner, { backgroundColor: '#F59E0B' + '15', borderColor: '#F59E0B' + '40' }]}>
              <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
              <Text style={[styles.pendingBannerText, { color: '#F59E0B' }]}>
                Your expert application is under review.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Segmented Control */}
      <View style={[styles.segmentWrapper, { backgroundColor: colors.background }]}>
        <View style={[styles.segmentContainer, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === "profile" && [styles.segmentButtonActive, { backgroundColor: colors.primary }]]}
          onPress={() => setActiveTab("profile")}
        >
          <Text style={[styles.segmentText, { color: colors.mutedText }, activeTab === "profile" && [styles.segmentTextActive, { color: isDark ? '#000' : '#fff' }]]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === "skills" && [styles.segmentButtonActive, { backgroundColor: colors.primary }]]}
          onPress={() => setActiveTab("skills")}
        >
          <Text style={[styles.segmentText, { color: colors.mutedText }, activeTab === "skills" && [styles.segmentTextActive, { color: isDark ? '#000' : '#fff' }]]}>
            My Ads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === "requests" && [styles.segmentButtonActive, { backgroundColor: colors.primary }]]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.segmentText, { color: colors.mutedText }, activeTab === "requests" && [styles.segmentTextActive, { color: isDark ? '#000' : '#fff' }]]}>
             Requests
          </Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === "profile" && (
          <>
            {/* Identity Profile Section */}
            <View style={styles.sectionHeaderInner}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitleModular, { color: colors.text }]}>Identity Profile</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Your basic account information</Text>
              </View>
              <TouchableOpacity onPress={() => onEdit('identity')} style={styles.editBtnSmall}>
                <Ionicons name="create-outline" size={20} color={colors.primary} />
                <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.identityInfoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
               <View style={styles.infoRow}>
                  <Ionicons name="at-outline" size={18} color={colors.mutedText} />
                  <Text style={[styles.infoText, { color: colors.text }]}>{user.handle}</Text>
               </View>
               <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={18} color={colors.mutedText} />
                  <Text style={[styles.infoText, { color: colors.text }]}>{user.contact || 'No contact info provided'}</Text>
               </View>
               <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color={colors.mutedText} />
                  <Text style={[styles.infoText, { color: colors.text }]}>Joined {user.joined}</Text>
               </View>
            </View>

            {/* Expert Profile Section */}
            <View style={[styles.sectionHeaderInner, { marginTop: 25 }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitleModular, { color: colors.text }]}>Expert Profile</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Professional status and skills</Text>
              </View>
            </View>

            {user.expertStatus === 'approved' && user.expertProfile ? (
              <View style={[styles.expertCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary + '33' }]}>
                <View style={styles.expertHeader}>
                  <View style={[styles.expertBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="star" size={12} color={isDark ? '#000' : '#fff'} />
                    <Text style={[styles.expertBadgeText, { color: isDark ? '#000' : '#fff' }]}>Verified Expert</Text>
                  </View>
                  <TouchableOpacity onPress={() => onEdit('expert')}>
                    <Text style={[styles.editLink, { color: colors.primary }]}>Edit Expert Settings</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.expertBio, { color: colors.text }]}>
                  {user.expertProfile?.description}
                </Text>
                <View style={styles.skillsTagList}>
                  {user.expertProfile?.skills?.map((skill) => (
                    <View key={skill} style={[styles.skillBadge, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
                      <Text style={[styles.skillBadgeText, { color: colors.text }]}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : user.expertStatus === 'pending' ? (
              <View style={[styles.statusCard, { backgroundColor: colors.iconBackground, borderColor: colors.primary + '44' }]}>
                <Ionicons name="time-outline" size={32} color={colors.primary} />
                <Text style={[styles.statusTitle, { color: colors.text }]}>Review in Progress</Text>
                <Text style={[styles.statusDescription, { color: colors.mutedText }]}>
                  Your expert profile application is currently being reviewed by our team. You'll be notified once it's active.
                </Text>
              </View>
            ) : (
              <View style={[styles.upgradeCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
                <View style={[styles.upgradeIcon, { backgroundColor: colors.primary + '1A' }]}>
                  <Ionicons name="sparkles-outline" size={32} color={colors.primary} />
                </View>
                <Text style={[styles.upgradeTitle, { color: colors.text }]}>Become an Expert</Text>
                <Text style={[styles.upgradeDescription, { color: colors.mutedText }]}>
                  Upgrade your account to offer services, post skill ads, and get discovered as a specialist.
                </Text>
                <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: colors.primary }]} onPress={() => onEdit('expert')}>
                  <Text style={[styles.upgradeButtonText, { color: isDark ? '#000' : '#fff' }]}>Build Skill Profile</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Activity Section */}
            <View style={[styles.sectionHeaderInner, { marginTop: 25 }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.text + '10' }]}>
                <Ionicons name="pulse-outline" size={20} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitleModular, { color: colors.text }]}>Latest Activity</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Recent updates from your profile</Text>
              </View>
            </View>

            <View style={[styles.activityCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              {activities.map((item, index) => (
                <View key={item.id} style={[styles.activityItem, index < activities.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                  <View style={[styles.activityIconContainer, { backgroundColor: colors.iconBackground }]}>
                    <Ionicons name={item.icon as any} size={18} color={colors.text} />
                  </View>
                  <View style={styles.activityTextContainer}>
                    <Text style={[styles.activityText, { color: colors.text }]}>{item.text}</Text>
                    <Text style={[styles.activityTime, { color: colors.mutedText }]}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}


        {activeTab === "skills" && (
          <View>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.text, borderColor: colors.border }]}
              onPress={onCreateAd}
            >
              <Ionicons name="add" size={20} color={colors.background} />
              <Text style={[styles.createButtonText, { color: colors.background }]}>Create New Ad</Text>
            </TouchableOpacity>
            <View style={styles.cardsGrid}>
              {user.ads.map(data => (
                <ContentCard 
                  key={data.id} 
                  data={data} 
                  isDesktop={isDesktop} 
                  isOwner={true} 
                  hideTag={true}
                  onEdit={() => onEditAd?.(data)} 
                  onDelete={() => onDeleteAd?.(data.id)}
                />
              ))}
              {user.ads.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>No ads offered yet.</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === "requests" && (
          <View>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.text, borderColor: colors.border }]}
              onPress={onCreateRequest}
            >
              <Ionicons name="add" size={20} color={colors.background} />
              <Text style={[styles.createButtonText, { color: colors.background }]}>Create New Request</Text>
            </TouchableOpacity>
            <View style={styles.cardsGrid}>
               {user.requests.map(data => (
                <ContentCard 
                  key={data.id} 
                  data={data} 
                  isDesktop={isDesktop} 
                  isOwner={true} 
                  hideTag={true}
                  onEdit={() => onEditRequest?.(data)} 
                  onDelete={() => onDeleteRequest?.(data.id)}
                />
              ))}
              {user.requests.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>No service requests yet.</Text>
              )}
            </View>
          </View>
        )}
      </View>
      </Animated.ScrollView>

      {/* Dynamic Floating Action Button */}
      <Animated.View 
        style={[
          styles.fabContainer, 
          { backgroundColor: colors.text, boxShadow: `0 8 20 ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}` },
          fabStyle
        ]}
      >
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={activeTab === "skills" ? onCreateAd : onCreateRequest}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color={colors.background} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  fabContainer: {
    position: "absolute",
    bottom: 110, // Above bottom navbar
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  fabButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.05)",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  pendingBannerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileCardDesktop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    marginBottom: 15,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  userJoined: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 20,
    gap: 8,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  segmentWrapper: {
    paddingBottom: 10,
    zIndex: 10,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 16,
  },
  segmentButtonActive: {
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "700",
  },
  segmentTextActive: {
  },
  tabContent: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 40,
    fontWeight: "600",
    width: "100%",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  skillsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#000",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  expertCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  expertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  expertBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  expertBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  editLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  expertBio: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  skillsTagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  skillBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusCard: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 15,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  upgradeCard: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dotted",
    alignItems: "center",
    marginBottom: 20,
  },
  upgradeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  upgradeDescription: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  upgradeButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  skillText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  activityCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.05)",
    elevation: 4,
  },
  sectionHeaderInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleModular: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 1,
    fontWeight: '500',
  },
  editBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#00000008',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  identityInfoCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 12,
    boxShadow: "0 8 24 rgba(0, 0, 0, 0.05)",
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});
