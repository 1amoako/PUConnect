import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import ContentCard, { CardData } from "./ContentCard";

interface ProfileViewProps {
  isDesktop: boolean;
  onEdit: () => void;
}

const MY_ADS: CardData[] = [
  {
    id: "m1",
    type: "skill",
    title: "Senior React Native Consulting",
    author: "Jacob Zero",
    description: "I offer architecture reviews and consulting for your React Native projects.",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80",
    price: "$120/hr"
  },
  {
    id: "m2",
    type: "skill",
    title: "UI/UX App Redesign",
    author: "Jacob Zero",
    description: "Complete overhaul of your mobile app's user experience.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    price: "$800"
  }
];

const MY_REQUESTS: CardData[] = [
  {
    id: "r1",
    type: "request",
    title: "Need Logo Animation",
    author: "Jacob Zero",
    description: "Looking for an After Effects wizard to animate our new startup logo.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    price: "$150"
  }
];

export default function ProfileView({ isDesktop, onEdit }: ProfileViewProps) {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "requests">("profile");

  // Mock user data
  const user = {
    name: "Jacob Zero",
    handle: "@jacobzero",
    joined: "March 2024",
    skills: ["React Native", "TypeScript", "UI/UX Design", "Next.js", "Node.js"],
    activities: [
      { id: "1", type: "skill", icon: "code-slash-outline", text: "Added Next.js to skills", time: "2 hours ago" },
      { id: "2", type: "connection", icon: "people-outline", text: "Connected with Alice Cooper", time: "1 day ago" },
      { id: "3", type: "system", icon: "rocket-outline", text: "Joined PUConnect", time: "3 days ago" },
    ]
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
    >
      {/* Profile Card */}
      <View style={[styles.profileCard, isDesktop && styles.profileCardDesktop, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.background }]}>{initial}</Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userHandle, { color: colors.mutedText }]}>{user.handle}</Text>
          <Text style={[styles.userJoined, { color: colors.mutedText }]}>Joined {user.joined}</Text>
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
            <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.text, borderColor: colors.border }]} onPress={onEdit}>
              <Ionicons name="pencil" size={20} color={colors.background} />
              <Text style={[styles.createButtonText, { color: colors.background }]}>Update Profile</Text>
            </TouchableOpacity>

            <View style={[styles.skillsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {user.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillTag, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
                    <Text style={[styles.skillText, { color: colors.secondaryText }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.activityCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity</Text>
              <View style={styles.activityList}>
                {user.activities.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={[styles.activityIconContainer, { backgroundColor: colors.iconBackground }]}>
                      <Ionicons name={activity.icon as any} size={18} color={colors.text} />
                    </View>
                    <View style={styles.activityTextContainer}>
                      <Text style={[styles.activityText, { color: colors.text }]}>{activity.text}</Text>
                      <Text style={[styles.activityTime, { color: colors.mutedText }]}>{activity.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === "skills" && (
          <View>
            <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.text, borderColor: colors.border }]}>
              <Ionicons name="add" size={20} color={colors.background} />
              <Text style={[styles.createButtonText, { color: colors.background }]}>Create New Ad</Text>
            </TouchableOpacity>
            <View style={styles.cardsGrid}>
              {MY_ADS.map(data => (
                <ContentCard key={data.id} data={data} isDesktop={isDesktop} isOwner={true} onEdit={() => console.log('Edit', data.id)} />
              ))}
              {MY_ADS.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>No ads offered yet.</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === "requests" && (
          <View>
            <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.text, borderColor: colors.border }]}>
              <Ionicons name="add" size={20} color={colors.background} />
              <Text style={[styles.createButtonText, { color: colors.background }]}>Create New Request</Text>
            </TouchableOpacity>
            <View style={styles.cardsGrid}>
               {MY_REQUESTS.map(data => (
                <ContentCard key={data.id} data={data} isDesktop={isDesktop} isOwner={true} onEdit={() => console.log('Edit', data.id)} />
              ))}
              {MY_REQUESTS.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>No service requests yet.</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    marginBottom: 20,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
    elevation: 4,
  },
  profileCardDesktop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#000",
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
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
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
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#eee",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
    elevation: 4,
  },
  activityList: {
    marginTop: 5,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
});
