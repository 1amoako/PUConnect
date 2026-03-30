import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export interface NotificationItem {
  id: string;
  type: "order" | "social" | "review" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color?: string;
  actionPath: string;
  actionTab?: "chat" | "discover" | "profile" | "admin" | "home";
  relatedEntityId?: string;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "review",
    title: "New 5-Star Review",
    message: "Sarah Jenkins left a wonderful review on your profile.",
    time: "2m ago",
    isRead: false,
    icon: "star",
    actionPath: "/profile",
    actionTab: "profile",
    relatedEntityId: "1",
  },
  {
    id: "2",
    type: "order",
    title: "Service Completion",
    message: "David Chen submitted a service for your final approval.",
    time: "15m ago",
    isRead: false,
    icon: "checkbox",
    actionPath: "/chat",
    actionTab: "chat",
    relatedEntityId: "2",
  },
  {
    id: "3",
    type: "social",
    title: "New Connection",
    message: "Alice Cooper started following you.",
    time: "1h ago",
    isRead: true,
    icon: "person-add",
    actionPath: "/discover",
    actionTab: "discover",
    relatedEntityId: "3",
  },
  {
    id: "4",
    type: "system",
    title: "Expert Profile Verified",
    message: "Your expert application has been approved! You can now offer services.",
    time: "1d ago",
    isRead: true,
    icon: "shield-checkmark",
    actionPath: "/profile",
    actionTab: "profile",
  },
];

interface NotificationsViewProps {
  isDesktop: boolean;
  onNotificationPress: (item: NotificationItem) => void;
}

export default function NotificationsView({ isDesktop, onNotificationPress }: NotificationsViewProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const renderNotification = (item: NotificationItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.notificationItem,
        { borderBottomColor: colors.border },
        !item.isRead && { backgroundColor: colors.iconBackground + "40" },
      ]}
      onPress={() => onNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name={item.icon as any} size={20} color={colors.background} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.time, { color: colors.mutedText }]}>{item.time}</Text>
        </View>
        <Text style={[styles.message, { color: colors.secondaryText }]} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={styles.headerSection}>
        <View style={[styles.searchBox, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search notifications"
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.mutedText} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.desktopContent]}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_NOTIFICATIONS.map(renderNotification)}

        {SAMPLE_NOTIFICATIONS.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.mutedText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications</Text>
            <Text style={[styles.emptySub, { color: colors.mutedText }]}>
              We&apos;ll let you know when something important happens.
            </Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    height: "100%",
  },
  menuButton: {
    marginLeft: 15,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  desktopContent: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  notificationItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 20,
  },
  emptySub: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },

});

