import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";

interface AdminDashboardProps {
  isDesktop: boolean;
  onReviewAll: () => void;
  pendingApplications?: any[];
  onApproveExpert?: (userId: string) => void;
}

export default function AdminDashboard({ isDesktop, onReviewAll, pendingApplications = [], onApproveExpert }: AdminDashboardProps) {
  const { colors, isDark } = useTheme();

  const stats = [
    { id: "1", label: "Pending Verifications", value: (8 + pendingApplications.length).toString(), icon: "person-add-outline" },
    { id: "2", label: "New Skill Submissions", value: "14", icon: "construct-outline" },
    { id: "3", label: "Reported Skills", value: "2", icon: "flag-outline" },
    { id: "4", label: "System Uptime", value: "99.9%", icon: "pulse-outline" },
  ];

  const recentActivity = [
    ...pendingApplications.map(app => ({
      id: app.id,
      user: app.name,
      action: "applied for Expert Status",
      time: "Just now",
      icon: "rocket-outline",
      isPending: true
    })),
    { id: "a1", user: "Jacob Zero", action: "submitted a new profile for verification", time: "10 mins ago", icon: "person-outline" },
    { id: "a2", user: "Sarah Jenkins", action: "added 'UI/UX Design' to their skills", time: "25 mins ago", icon: "construct-outline" },
    { id: "a3", user: "David Chen", action: "reported a suspicious profile", time: "1 hour ago", icon: "alert-circle-outline" },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Admin Panel</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>System management & moderation</Text>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
        {stats.map((stat) => (
          <View 
            key={stat.id} 
            style={[
              styles.statCard, 
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
              isDesktop && styles.statCardDesktop
            ]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Verification Queue */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Moderation Queue</Text>
          <GlassButton 
            title="Review All" 
            onPress={onReviewAll}
            style={styles.reviewAllBtn}
          />
        </View>
        
        {recentActivity.map((activity) => (
          <TouchableOpacity key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.activityIcon, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name={activity.icon as any} size={18} color={colors.text} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityText, { color: colors.text }]}>
                <Text style={styles.boldText}>{activity.user}</Text> {activity.action}
              </Text>
              <Text style={[styles.activityTime, { color: colors.mutedText }]}>{activity.time}</Text>
            </View>
            {(activity as any).isPending ? (
              <TouchableOpacity 
                style={[styles.approveBadge, { backgroundColor: colors.primary }]}
                onPress={() => onApproveExpert?.(activity.id)}
              >
                <Text style={[styles.approveText, { color: isDark ? '#000' : '#fff' }]}>Approve</Text>
              </TouchableOpacity>
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Admin Quick Actions */}
      <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>System Controls</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="settings-outline" size={20} color={colors.background} />
          <Text style={[styles.actionText, { color: colors.background }]}>Global Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.iconBackground, borderColor: colors.border, borderWidth: 1 }]}>
          <Ionicons name="people-outline" size={20} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>Users List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  desktopContent: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
    paddingTop: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 30,
  },
  statsGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  statCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    elevation: 2,
    width: "100%", // 1 column on mobile
  },
  statCardDesktop: {
    width: "23.5%", // 4 columns on desktop
    paddingVertical: 18,
    paddingHorizontal: 15,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statInfo: {
    gap: 2,
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    marginBottom: 30,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  reviewAllBtn: {
    paddingHorizontal: 20,
    minWidth: 120,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "700",
  },
  activityTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 15,
    marginLeft: 5,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 18,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
  },
  approveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
