import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";

interface NotificationItem {
  id: string;
  type: "like" | "comment" | "mention" | "system" | "order";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color?: string;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "like",
    title: "New Like",
    message: "Sarah Jenkins liked your UI/UX Design Studio post.",
    time: "2m ago",
    isRead: false,
    icon: "heart",
  },
  {
    id: "2",
    type: "order",
    title: "New Order",
    message: "You have a new order for 'Mechanical Keyboard Pro'.",
    time: "15m ago",
    isRead: false,
    icon: "cart",
  },
  {
    id: "3",
    type: "mention",
    title: "Mentioned",
    message: "David Chen mentioned you in a comment: '@jacobzero looks good!'",
    time: "1h ago",
    isRead: true,
    icon: "at",
  },
  {
    id: "4",
    type: "comment",
    title: "New Comment",
    message: "Alice Cooper commented on your profile.",
    time: "3h ago",
    isRead: true,
    icon: "chatbubble",
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "Your profile has been successfully verified by the admin team.",
    time: "1d ago",
    isRead: true,
    icon: "shield-checkmark",
  },
];

interface NotificationsViewProps {
  isDesktop: boolean;
}

export default function NotificationsView({ isDesktop }: NotificationsViewProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const renderNotification = (item: NotificationItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.notificationItem,
        { borderBottomColor: colors.border },
        !item.isRead && { backgroundColor: colors.iconBackground + "40" },
      ]}
      onPress={() => setSelectedNotification(item)}
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

      {/* Notification Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectedNotification}
        onRequestClose={() => setSelectedNotification(null)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} 
          activeOpacity={1} 
          onPress={() => setSelectedNotification(null)}
        >
          <GlassContainer style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
            {selectedNotification && (
              <>
                <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name={selectedNotification.icon as any} size={40} color={colors.background} />
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedNotification.title}</Text>
                <Text style={[styles.modalTime, { color: colors.mutedText }]}>{selectedNotification.time}</Text>
                <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
                  {selectedNotification.message}
                </Text>
                
                <View style={styles.modalButtons}>
                  <GlassButton 
                    title="Close" 
                    onPress={() => setSelectedNotification(null)}
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
          </GlassContainer>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 30,
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
    textAlign: "center",
  },
  modalTime: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  modalButtons: {
    width: "100%",
  },
  modalButton: {
    width: "100%",
  },
});

