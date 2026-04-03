import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ReportModal } from "./ReportModal";

interface PeopleViewProps {
  isDesktop: boolean;
  onViewMyProfile: () => void;
  onProfileClick: (profileId: string) => void;
}

interface UserProfile {
  id: string;
  name: string;
  status: string;
  skills: string[];
  category: string;
}

const CATEGORIES = ["All", "Design", "Development", "Marketing", "Business"];

const MOCK_PROFILES: UserProfile[] = [
  { id: "1", name: "Sarah Jenkins", status: "Open to new design opportunities.", skills: ["UI Design", "UX Research", "Figma"], category: "Design" },
  { id: "p1", name: "Alice Cooper", status: "Looking for freelance mobile work.", skills: ["React Native", "UI/UX", "Figma"], category: "Design" },
  { id: "3", name: "David Chen", status: "Available for full-stack contracts.", skills: ["React Native", "TypeScript", "Node.js"], category: "Development" },
  { id: "p4", name: "Michael Chang", status: "Seeking backend engineering roles.", skills: ["Python", "Django", "PostgreSQL"], category: "Development" },
  { id: "p5", name: "Emma Wilson", status: "Freelance social media manager.", skills: ["Instagram", "Content Creation", "SEO"], category: "Marketing" },
  { id: "p6", name: "James Carter", status: "Helping startups scale operations.", skills: ["Strategy", "Operations", "Agile"], category: "Business" },
  { id: "p7", name: "Olivia Martinez", status: "Crafting beautiful brand identities.", skills: ["Branding", "Illustrator", "Typography"], category: "Design" },
  { id: "p8", name: "William Davis", status: "Building scalable cloud infrastructure.", skills: ["AWS", "Docker", "Kubernetes"], category: "Development" },
  { id: "p9", name: "Sophia Taylor", status: "Digital marketing and paid ads specialist.", skills: ["Google Ads", "Facebook Ads", "Analytics"], category: "Marketing" },
  { id: "p10", name: "Lucas Anderson", status: "Business development & B2B sales.", skills: ["Sales", "B2B", "Negotiation"], category: "Business" },
];

export default function PeopleView({ isDesktop, onViewMyProfile, onProfileClick }: PeopleViewProps) {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportTargetName, setReportTargetName] = useState("");

  const filteredProfiles = activeFilter === "All" 
    ? MOCK_PROFILES 
    : MOCK_PROFILES.filter(p => p.category === activeFilter);

  const renderFilterPills = () => (
    <View style={[styles.filtersWrapper, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterPill,
                { backgroundColor: isActive ? colors.primary : colors.iconBackground, borderColor: colors.border }
              ]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[
                styles.filterText,
                { color: isActive ? colors.background : colors.text }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderProfileCard = (profile: UserProfile) => (
    <TouchableOpacity 
      key={profile.id} 
      style={[
        styles.profileCard, 
        { 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.border,
          zIndex: activeMenuId === profile.id ? 100 : 1
        }
      ]}
      onPress={() => {
        if (activeMenuId) {
          setActiveMenuId(null);
        } else {
          onProfileClick(profile.id);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={[styles.profileHeader, { zIndex: 10 }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.iconBackground }]}>
          <Text style={[styles.avatarText, { color: colors.text }]}>{profile.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
          <Text style={[styles.profileStatus, { color: colors.mutedText }]}>{profile.status}</Text>
        </View>
        <View style={{ zIndex: 10 }}>
          <TouchableOpacity 
            style={styles.headerMenuBtn}
            onPress={() => setActiveMenuId(activeMenuId === profile.id ? null : profile.id)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </TouchableOpacity>
          {activeMenuId === profile.id && (
            <View style={[styles.dropdownMenu, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
               <TouchableOpacity 
                 style={styles.menuItem} 
                 onPress={() => {
                   setActiveMenuId(null);
                   setReportTargetName(profile.name);
                   setIsReportModalVisible(true);
                 }}
               >
                 <Ionicons name="warning-outline" size={16} color="#FF3B30" />
                 <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Report User</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.skillsContainer}>
        {profile.skills.map((skill, index) => (
          <View key={index} style={[styles.skillBadge, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
            <Text style={[styles.skillText, { color: colors.secondaryText }]}>{skill}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderFilterPills()}
      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={() => setActiveMenuId(null)}
        scrollEventThrottle={16}
      >
        {/* Call to Action for Profile */}
        <TouchableOpacity 
          style={[styles.ctaCard, { backgroundColor: colors.primary + '1A', borderColor: colors.primary }]}
          onPress={onViewMyProfile}
          activeOpacity={0.7}
        >
          <View style={styles.ctaContent}>
            <Ionicons name="person-circle" size={32} color={colors.primary} />
            <View style={styles.ctaTextContainer}>
              <Text style={[styles.ctaTitle, { color: colors.text }]}>Your Professional Profile</Text>
              <Text style={[styles.ctaSub, { color: colors.mutedText }]}>View your skills, activity, and update your information.</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.tabContent}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map(renderProfileCard)
          ) : (
            <Text style={{ color: colors.mutedText, textAlign: 'center', marginTop: 40 }}>No people found in this category.</Text>
          )}
        </View>
      </ScrollView>

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        targetName={reportTargetName}
        isDesktop={isDesktop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersWrapper: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  filtersContainer: {
    paddingHorizontal: 25,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 140, // Space for bottom nav
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 25,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 15,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 14,
  },
  tabContent: {
    flex: 1,
  },
  profileCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  headerMenuBtn: {
    padding: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    boxShadow: "0 4 15 rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
