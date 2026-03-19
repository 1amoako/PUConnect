import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface PeopleViewProps {
  isDesktop: boolean;
  onEditProfile: () => void;
}

type SubTab = "people" | "me";

interface UserProfile {
  id: string;
  name: string;
  status: string;
  skills: string[];
}

const MOCK_PROFILES: UserProfile[] = [
  { id: "p1", name: "Alice Cooper", status: "Looking for freelance mobile work.", skills: ["React Native", "UI/UX", "Figma"] },
  { id: "p2", name: "David Chen", status: "Available for full-stack contracts.", skills: ["Node.js", "React", "PostgreSQL"] },
  { id: "p3", name: "Sarah Jenkins", status: "Open to new design opportunities.", skills: ["Graphic Design", "Branding", "Illustration"] },
];

const MY_PROFILE: UserProfile | null = { id: "me1", name: "Jacob Zero", status: "Looking for new projects.", skills: ["React Native", "TypeScript", "UI Design"] };

export default function PeopleView({ isDesktop, onEditProfile }: PeopleViewProps) {
  const { colors, isDark } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("people");
  const hasProfile = MY_PROFILE !== null;

  const renderBanner = () => (
    <View style={[styles.bannerContainer, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: colors.border }]}>
      <Text style={[styles.bannerText, { color: colors.text }]}>
        Find skilled people to assist you right now!
      </Text>
      <View style={[styles.tabSwitcher, { backgroundColor: colors.iconBackground }]}>
        {(["people", "me"] as SubTab[]).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && [styles.tabButtonActive, { backgroundColor: colors.primary }]]}
              onPress={() => setActiveSubTab(tab)}
            >
              <Text style={[styles.tabText, { color: colors.mutedText }, isActive && [styles.tabTextActive, { color: colors.background }]]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderProfileCard = (profile: UserProfile) => (
    <View key={profile.id} style={[styles.profileCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.iconBackground }]}>
          <Text style={[styles.avatarText, { color: colors.text }]}>{profile.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
          <Text style={[styles.profileStatus, { color: colors.mutedText }]}>{profile.status}</Text>
        </View>
      </View>
      <View style={styles.skillsContainer}>
        {profile.skills.map((skill, index) => (
          <View key={index} style={[styles.skillBadge, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
            <Text style={[styles.skillText, { color: colors.secondaryText }]}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPeopleTab = () => (
    <View style={styles.tabContent}>
      {MOCK_PROFILES.map(renderProfileCard)}
    </View>
  );

  const renderMeTab = () => {
    const hasProfile = MY_PROFILE !== null;
    const isEmpty = !hasProfile;

    return (
      <View style={styles.tabContent}>
        {isEmpty ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.mutedText} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Nothing here yet</Text>
            <Text style={[styles.emptyStateSub, { color: colors.mutedText }]}>Create a profile to get started.</Text>
            <TouchableOpacity style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.emptyStateButtonText, { color: colors.background }]}>Get Started</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {hasProfile && MY_PROFILE && (
              <View style={styles.meSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>My Profile</Text>
                {renderProfileCard(MY_PROFILE)}
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderFAB = () => {
    if (activeSubTab === "people") return null;

    let icon: any = "person-add-outline";
    let label = hasProfile ? "Update Your Profile" : "Create Your Profile";

    if (activeSubTab === "me") {
      icon = hasProfile ? "create-outline" : "add";
    }

    return (
      <TouchableOpacity 
        style={[styles.floatingButton, isDesktop ? styles.floatingButtonDesktop : styles.floatingButtonMobile, { backgroundColor: colors.primary }]} 
        onPress={onEditProfile}
      >
        <Ionicons name={icon} size={24} color={colors.background} />
        <Text style={[styles.floatingButtonText, { color: colors.background }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSubTab === "people" && renderPeopleTab()}
        {activeSubTab === "me" && renderMeTab()}
      </ScrollView>
      {renderBanner()}
      {renderFAB()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    position: "absolute",
    top: 15,
    width: "92%",
    maxWidth: 960,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    zIndex: 10,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.12)",
    elevation: 5,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    lineHeight: 22,
    marginBottom: 15,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 165, // Space for the pill-shaped floating banner + its top margin
    paddingBottom: 140, // Space for bottom nav/FABs
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  tabContent: {
    flex: 1,
    minHeight: "100%", // Ensures absolute button has space to float
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  floatingButton: {
    position: "absolute",
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    elevation: 10,
    zIndex: 100,
  },
  floatingButtonMobile: {
    bottom: 115, // Sit just above the floating bottom nav
    right: 20,
  },
  floatingButtonDesktop: {
    bottom: 30,
    right: 40,
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  editButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  emptyStateButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  meSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
    marginLeft: 5,
  },
});
