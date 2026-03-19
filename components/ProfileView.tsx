import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface ProfileViewProps {
  isDesktop: boolean;
}

export default function ProfileView({ isDesktop }: ProfileViewProps) {
  const { colors } = useTheme();
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

        <TouchableOpacity style={[styles.updateButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.updateButtonText, { color: colors.background }]}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Skills Card */}
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

      {/* Activity Card */}
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
  updateButton: {
    backgroundColor: "#000",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    maxWidth: 200,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  skillsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#eee",
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
    marginTop: 20,
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

