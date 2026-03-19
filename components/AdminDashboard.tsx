import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface AdminDashboardProps {
  isDesktop: boolean;
}

export default function AdminDashboard({ isDesktop }: AdminDashboardProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const stats = [
    { id: "1", label: "Pending Profiles", value: "12", icon: "person-add-outline", color: "#FF9500" },
    { id: "2", label: "Reported Items", value: "3", icon: "flag-outline", color: "#FF3B30" },
    { id: "3", label: "Active Skills", value: "156", icon: "construct-outline", color: "#34C759" },
    { id: "4", label: "Active Products", value: "89", icon: "cart-outline", color: "#007AFF" },
  ];

  const pendingReviews = [
    { id: "r1", name: "Jacob Zero", type: "Profile Update", time: "10 mins ago" },
    { id: "r2", name: "Sarah Jenkins", type: "New Skill", time: "25 mins ago" },
    { id: "r3", name: "Alex Rivera", type: "Product Listing", time: "1 hour ago" },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Manage PUConnect platform</Text>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
        {stats.map((stat) => (
          <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "15" }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pending Reviews */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Reviews</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {pendingReviews.map((review) => (
          <TouchableOpacity key={review.id} style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
            <View style={styles.reviewInfo}>
              <Text style={[styles.reviewName, { color: colors.text }]}>{review.name}</Text>
              <Text style={[styles.reviewType, { color: colors.mutedText }]}>{review.type}</Text>
            </View>
            <View style={styles.reviewAction}>
              <Text style={[styles.reviewTime, { color: colors.mutedText }]}>{review.time}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionLabel, { color: colors.mutedText }]}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.background} />
          <Text style={[styles.actionText, { color: colors.background }]}>Platform Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.iconBackground }]}>
          <Ionicons name="people-outline" size={20} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>User Management</Text>
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
    paddingBottom: 120,
  },
  desktopContent: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 25,
  },
  statsGridDesktop: {
    flexWrap: "nowrap",
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "700",
  },
  reviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  reviewType: {
    fontSize: 13,
  },
  reviewAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewTime: {
    fontSize: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
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
    paddingVertical: 15,
    borderRadius: 15,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
