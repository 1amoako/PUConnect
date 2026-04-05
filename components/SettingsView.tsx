import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";
import { GlassContainer } from "./GlassContainer";
import { FeedbackModal } from "./FeedbackModal";

interface SettingsViewProps {
  isDesktop: boolean;
  onBack: () => void;
}

export default function SettingsView({ isDesktop, onBack }: SettingsViewProps) {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Granular Notification States
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifySocial, setNotifySocial] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // After logout, the user must be taken to the login screen.
    router.replace("/");
  };

  const renderSettingRow = (icon: string, label: string, value?: React.ReactNode, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.settingRow, { borderBottomColor: colors.divider }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
          <Ionicons name={icon as any} size={20} color={colors.text} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value}
        {onPress && <Ionicons name="chevron-forward" size={18} color={colors.mutedText} style={{ marginLeft: 10 }} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* Appearance Group */}
      <View style={styles.group}>
        <Text style={[styles.groupTitle, { color: colors.mutedText }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {renderSettingRow(
            "moon-outline", 
            "Dark Mode", 
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: "#eee", true: colors.primary }}
              thumbColor="#fff"
            />
          )}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {renderSettingRow("color-palette-outline", "Theme Color", <Text style={[styles.valueText, { color: colors.mutedText }]}>Monochrome</Text>, () => {})}
        </View>
      </View>

      {/* Account Group */}
      <View style={styles.group}>
        <Text style={[styles.groupTitle, { color: colors.mutedText }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {renderSettingRow("person-outline", "Edit Profile", null, () => {})}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {renderSettingRow(
            "notifications-outline", 
            "Notifications", 
            <Text style={[styles.valueText, { color: colors.mutedText }]}>Custom</Text>,
            () => setShowNotificationSettings(true)
          )}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {renderSettingRow("shield-checkmark-outline", "Privacy", null, () => {})}
        </View>
      </View>

      {/* About Group */}
      <View style={styles.group}>
        <Text style={[styles.groupTitle, { color: colors.mutedText }]}>System</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {renderSettingRow("trash-outline", "Clear Cache", null, () => {})}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {renderSettingRow("information-circle-outline", "About", <Text style={[styles.valueText, { color: colors.mutedText }]}>v1.0.4</Text>, () => {})}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {renderSettingRow("bulb-outline", "Share Feedback", null, () => setShowFeedbackModal(true))}
        </View>
      </View>

      {/* Session Group */}
      <View style={styles.group}>
        <Text style={[styles.groupTitle, { color: colors.mutedText }]}>Session</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.danger }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutConfirm}
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} 
          activeOpacity={1} 
          onPress={() => setShowLogoutConfirm(false)}
        >
          <GlassContainer style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.modalIconBackground }]}>
              <Ionicons name="log-out" size={40} color={colors.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Logout Confirmation</Text>
            <Text style={[styles.modalDescription, { color: colors.mutedText }]}>Are you sure you want to log out of PUConnect?</Text>
            
            <View style={styles.modalButtons}>
              <GlassButton 
                title="Cancel" 
                variant="secondary" 
                onPress={() => setShowLogoutConfirm(false)}
                style={[styles.modalButton, { flex: 1, borderColor: colors.primary }]}
              />
              <GlassButton 
                title="Log Out" 
                onPress={handleLogout}
                style={[styles.modalButton, styles.logoutButton, { flex: 1, backgroundColor: colors.danger, borderColor: colors.danger }]}
              />
            </View>
          </GlassContainer>
        </TouchableOpacity>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotificationSettings}
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: colors.overlay, justifyContent: "flex-end", padding: 0 }]} 
          activeOpacity={1} 
          onPress={() => setShowNotificationSettings(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.bottomSheetWrapper}>
            <GlassContainer style={[styles.bottomSheetModal, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.sheetHandle} />
              
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: colors.text }]}>Alerts & Sounds</Text>
                <Text style={[styles.sheetSub, { color: colors.mutedText }]}>
                  Choose which events trigger push notifications.
                </Text>
              </View>

              <View style={styles.sheetToggles}>
                {renderSettingRow("chatbubble-outline", "Direct Messages", 
                  <Switch value={notifyMessages} onValueChange={setNotifyMessages} trackColor={{ false: "#eee", true: colors.primary }} thumbColor="#fff" />
                )}
                {renderSettingRow("cart-outline", "Service Orders", 
                  <Switch value={notifyOrders} onValueChange={setNotifyOrders} trackColor={{ false: "#eee", true: colors.primary }} thumbColor="#fff" />
                )}
                {renderSettingRow("people-outline", "Social Activity", 
                  <Switch value={notifySocial} onValueChange={setNotifySocial} trackColor={{ false: "#eee", true: colors.primary }} thumbColor="#fff" />
                )}
                {renderSettingRow("shield-checkmark-outline", "System Alerts", 
                  <Switch value={notifySystem} onValueChange={setNotifySystem} trackColor={{ false: "#eee", true: colors.primary }} thumbColor="#fff" />
                )}
              </View>

              <View style={styles.sheetAction}>
                <GlassButton 
                  title="Done" 
                  onPress={() => setShowNotificationSettings(false)}
                  style={styles.modalButton}
                  textStyle={styles.doneButtonText}
                />
              </View>
            </GlassContainer>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <FeedbackModal
        visible={showFeedbackModal}
        isDesktop={isDesktop}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(cat, sug, imp) => {
          console.log("Feedback submitted:", { cat, sug, imp });
          // In a real app, this would be an API call.
          // We can also trigger a global notification here.
        }}
      />
    </ScrollView>
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
    paddingBottom: 140,
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },
  group: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
    boxShadow: "0 4 20 rgba(0, 0, 0, 0.03)",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f5f5f5",
    marginLeft: 70,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  bottomSheetWrapper: {
    width: "100%",
    alignItems: "center",
  },
  bottomSheetModal: {
    width: "100%",
    maxWidth: 600,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 25,
  },
  sheetHeader: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  sheetSub: {
    fontSize: 15,
    lineHeight: 22,
  },
  sheetToggles: {
    marginHorizontal: -10,
    marginBottom: 10,
  },
  sheetAction: {
    marginTop: 10,
    width: "100%",
  },
});

