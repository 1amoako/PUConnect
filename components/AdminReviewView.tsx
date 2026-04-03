import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GlassContainer } from "./GlassContainer";
import { GlassTextInput } from "./GlassTextInput";

type AdminTab = "verifications" | "reports" | "feedback";
type ActionType = "approve" | "reject" | "request_changes" | "ban" | "warning" | "acknowledge" | "promote_admin" | null;

interface AdminReviewViewProps {
  isDesktop: boolean;
  onBack: () => void;
  isManagementOpen?: boolean;
  onCloseManagement?: () => void;
}

const MOCK_VERIFICATIONS = [
  { 
    id: "v1", 
    name: "Sarah Jenkins", 
    type: "Profile Update", 
    status: "Pending", 
    time: "10m ago",
    email: "sarah.j@example.com",
    bio: "Passionate UI/UX designer with 5 years experience.",
    skills: ["Figma", "Research"],
    location: "Accra",
    joinedDate: "2024-01-15"
  },
  { id: "v2", name: "David Chen", type: "New Account", status: "In Review", time: "25m ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
  { id: "v3", name: "Alex Rivera", type: "Skill Verification", status: "Pending", time: "1h ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
  { id: "v4", name: "John Mensah", type: "Expert Status", status: "Pending", time: "2h ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
  { id: "v5", name: "Amara Okeke", type: "New Account", status: "Pending", time: "3h ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
  { id: "v6", name: "Kwame Boateng", type: "Profile Update", status: "Pending", time: "4h ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
  { id: "v7", name: "Naa Ayeley", type: "Expert Status", status: "Pending", time: "5h ago", email: "", bio: "", skills: [], location: "", joinedDate: "" },
];

const MOCK_REPORTS = [
  { id: "r1", user: "John Doe", reason: "Inappropriate content", reporter: "Sarah J.", time: "2h ago", description: "", evidence: "", priority: "High" },
  { id: "r2", user: "Unknown", reason: "Spam behavior", reporter: "System", time: "5h ago", description: "", evidence: "", priority: "Medium" },
  { id: "r3", user: "Bad Actor", reason: "Scam", reporter: "Alice C.", time: "8h ago", description: "", evidence: "", priority: "High" },
  { id: "r4", user: "Rude User", reason: "Harassment", reporter: "Mark T.", time: "1d ago", description: "", evidence: "", priority: "High" },
  { id: "r5", user: "Bot Account", reason: "Spam", reporter: "System", time: "2d ago", description: "", evidence: "", priority: "Low" },
];

const MOCK_FEEDBACK = [
  { 
    id: "f1", 
    user: "Jacob Zero", 
    suggestion: "Add dark mode toggle to quick settings", 
    time: "1d ago",
    category: "Feature Request",
    impact: "UX Improvement"
  },
  { 
    id: "f2", 
    user: "Alice Cooper", 
    suggestion: "Improve search filtering for skill levels", 
    time: "2d ago",
    category: "UI Improvement",
    impact: "Efficiency"
  },
];

const MOCK_USERS = [
  { id: "u1", name: "Jacob Zero", email: "jacob@example.com", role: "Expert", joined: "2023-12-01", status: "Active" },
  { id: "u2", name: "Sarah Jenkins", email: "sarah.j@example.com", role: "Expert", joined: "2024-01-15", status: "Active" },
  { id: "u3", name: "David Chen", email: "david.c@example.com", role: "User", joined: "2024-02-10", status: "Active" },
  { id: "u4", name: "Alice Cooper", email: "alice@example.com", role: "User", joined: "2024-02-20", status: "Active" },
  { id: "u5", name: "John Doe", email: "john@example.com", role: "User", joined: "2024-03-01", status: "Flagged" },
  { id: "u6", name: "Michael Smith", email: "mike@example.com", role: "User", joined: "2024-03-05", status: "Active" },
  { id: "u7", name: "Emily Brown", email: "emily@example.com", role: "Expert", joined: "2024-03-10", status: "Active" },
];

const STATS = [
  { id: "1", label: "Queue", value: "8", icon: "person-add-outline", color: "#007AFF" },
  { id: "2", label: "Content", value: "23", icon: "construct-outline", color: "#5856D6" },
  { id: "3", label: "Reports", value: "3", icon: "flag-outline", color: "#FF3B30" },
];

export default function AdminReviewView({ isDesktop, onBack, isManagementOpen, onCloseManagement }: AdminReviewViewProps) {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>("verifications");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "success" | "failure">("idle");
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"All" | "Expert" | "User">("All");

  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isManagementOpen !== undefined) {
      setIsUserManagementOpen(isManagementOpen);
    }
  }, [isManagementOpen]);

  useEffect(() => {
    if (actionStatus === "loading") {
      // Material You style bouncing dots animation
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animateDot(dot1Anim, 0);
      animateDot(dot2Anim, 150);
      animateDot(dot3Anim, 300);
    } else {
      // Stop all animations
      dot1Anim.stopAnimation();
      dot2Anim.stopAnimation();
      dot3Anim.stopAnimation();
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
    }
  }, [actionStatus, dot1Anim, dot2Anim, dot3Anim]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setShowModal(false);
    setPendingAction(null);
    setAdminMessage("");
    setActionStatus("idle");
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
    setPendingAction(null);
    setAdminMessage("");
    setActionStatus("idle");
  };


  const renderVerifications = () => (
    <View style={styles.listContainer}>
      {MOCK_VERIFICATIONS.map((item) => (
        <GlassContainer key={item.id} style={[styles.itemCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <View>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemType, { color: colors.mutedText }]}>{item.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.iconBackground }]}>
              <Text style={[styles.statusText, { color: colors.primary }]}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.itemFooter}>
            <Text style={[styles.itemTime, { color: colors.mutedText }]}>{item.time}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={[styles.actionBtnText, { color: colors.background }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassContainer>
      ))}
    </View>
  );

  const renderReports = () => (
    <View style={styles.listContainer}>
      {MOCK_REPORTS.map((item) => (
        <GlassContainer key={item.id} style={[styles.itemCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <View>
              <Text style={[styles.itemName, { color: colors.text }]}>Report: {item.user}</Text>
              <Text style={[styles.itemType, { color: "#FF3B30" }]}>{item.reason}</Text>
            </View>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
          </View>
          <Text style={[styles.itemDescription, { color: colors.secondaryText }]} numberOfLines={2}>
            Reported by <Text style={styles.bold}>{item.reporter}</Text> • {item.time}
          </Text>
          <View style={styles.itemFooter}>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={[styles.actionBtnText, { color: colors.background }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassContainer>
      ))}
    </View>
  );

  const renderFeedback = () => (
    <View style={styles.listContainer}>
      {MOCK_FEEDBACK.map((item) => (
        <GlassContainer key={item.id} style={[styles.itemCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.user}</Text>
            <Text style={[styles.itemTime, { color: colors.mutedText }]}>{item.time}</Text>
          </View>
          <Text style={[styles.itemDescription, { color: colors.secondaryText }]} numberOfLines={2}>
            &quot;{item.suggestion}&quot;
          </Text>
          <View style={styles.itemFooter}>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={[styles.actionBtnText, { color: colors.background }]}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassContainer>
      ))}
    </View>
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setPendingAction(null);
    setAdminMessage("");
    setActionStatus("idle");
  };

  const handleActionClick = (action: ActionType) => {
    // Actions that require a message
    const requiresMessage = ["reject", "request_changes", "ban", "warning"].includes(action || "");
    
    if (requiresMessage) {
      setPendingAction(action);
    } else {
      // Direct action (approve/acknowledge)
      handleConfirmAction(action);
    }
  };

  const handleConfirmAction = (action: ActionType) => {
    setActionStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      // 90% success rate for simulation
      const isSuccess = Math.random() > 0.1;
      setActionStatus(isSuccess ? "success" : "failure");
      
      if (isSuccess) {
        // Automatically close after 2 seconds on success
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    }, 1500);
  };

  const renderDetailsModal = () => {
    if (!selectedItem) return null;

    const isVerification = activeTab === "verifications";
    const isReport = activeTab === "reports";
    const isFeedback = activeTab === "feedback";

    const renderModalContent = () => {
      if (actionStatus === "loading") {
        return (
          <View style={styles.statusContainer}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: colors.primary,
                transform: [{ translateY: dot3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15]
                }) }]
              }
            ]}
          />
        </View>
        <Text style={[styles.statusTitle, { color: colors.text }]}>Processing Action...</Text>
        <Text style={[styles.statusSub, { color: colors.mutedText }]}>Please wait while we update the system.</Text>
      </View>
        );
      }

      if (actionStatus === "success") {
        return (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIconCircle, { backgroundColor: '#34C75920' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#34C759" />
            </View>
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              {pendingAction === "promote_admin" ? "User Elevated!" : "Action Successful!"}
            </Text>
            <Text style={[styles.statusSub, { color: colors.mutedText }]}>
              {pendingAction === "promote_admin" 
                ? `${selectedItem?.name} has been promoted to Administrator.` 
                : "The issue has been resolved and the user notified."}
            </Text>
          </View>
        );
      }

      if (actionStatus === "failure") {
        return (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIconCircle, { backgroundColor: '#FF3B3020' }]}>
              <Ionicons name="alert-circle" size={64} color="#FF3B30" />
            </View>
            <Text style={[styles.statusTitle, { color: colors.text }]}>Action Failed</Text>
            <Text style={[styles.statusSub, { color: colors.mutedText }]}>Something went wrong. Please try again later.</Text>
            <TouchableOpacity 
              style={[styles.modalActionBtn, { backgroundColor: colors.primary, marginTop: 20 }]}
              onPress={() => setActionStatus("idle")}
            >
              <Text style={[styles.modalActionBtnText, { color: colors.background }]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isVerification ? "Verification Details" : isReport ? "Incident Report" : "Feedback Detail"}
            </Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            {isVerification && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>User Info</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.name}</Text>
                  <Text style={[styles.detailSubValue, { color: colors.secondaryText }]}>{selectedItem.email}</Text>
                  <Text style={[styles.detailSubValue, { color: colors.secondaryText }]}>{selectedItem.location}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Bio</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.bio}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Skills Submitted</Text>
                  <View style={styles.skillBadgeContainer}>
                    {selectedItem?.skills?.map((skill: string, index: number) => (
                      <View key={index} style={[styles.detailSkillBadge, { backgroundColor: colors.iconBackground }]}>
                        <Text style={[styles.detailSkillText, { color: colors.primary }]}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Application Meta</Text>
                  <Text style={[styles.detailSubValue, { color: colors.secondaryText }]}>Joined: {selectedItem.joinedDate}</Text>
                  <Text style={[styles.detailSubValue, { color: colors.secondaryText }]}>Request Type: {selectedItem.type}</Text>
                </View>
              </View>
            )}

            {isReport && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Reported User</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.user}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: selectedItem.priority === "High" ? "#FF3B3020" : colors.iconBackground }]}>
                    <Text style={[styles.priorityText, { color: selectedItem.priority === "High" ? "#FF3B30" : colors.primary }]}>
                      {selectedItem.priority} Priority
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Reason</Text>
                  <Text style={[styles.detailValue, { color: "#FF3B30" }]}>{selectedItem.reason}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Description</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.description}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Evidence</Text>
                  <Text style={[styles.detailValue, { color: colors.secondaryText }]}>{selectedItem.evidence}</Text>
                </View>
              </View>
            )}

            {isFeedback && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Submitted By</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.user}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Category</Text>
                  <View style={[styles.detailSkillBadge, { backgroundColor: colors.iconBackground }]}>
                    <Text style={[styles.detailSkillText, { color: colors.primary }]}>{selectedItem.category}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Suggestion</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedItem.suggestion}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.mutedText }]}>Expected Impact</Text>
                  <Text style={[styles.detailValue, { color: colors.secondaryText }]}>{selectedItem.impact}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            {pendingAction ? (
              <View style={styles.actionMessageContainer}>
                <Text style={[styles.actionPromptText, { color: colors.text }]}>
                  {pendingAction === "reject" ? "Rejecting Verification" : 
                   pendingAction === "request_changes" ? "Requesting Changes" : 
                   pendingAction === "promote_admin" ? "Elevate to Administrator" :
                   pendingAction === "ban" ? "Banning User" : "Issuing Warning"}
                </Text>
                {pendingAction === "promote_admin" ? (
                  <View style={styles.passwordChallenge}>
                    <Text style={[styles.challengeSub, { color: colors.mutedText }]}>
                      This is a high-level administrative action. Please verify your credentials to continue.
                    </Text>
                    <GlassTextInput
                      placeholder="Admin Password"
                      value={adminPassword}
                      onChangeText={setAdminPassword}
                      secureTextEntry
                      style={[styles.actionInput, { backgroundColor: colors.iconBackground, color: colors.text, borderColor: colors.border }]}
                    />
                  </View>
                ) : (
                  <GlassTextInput
                    placeholder="Add message (optional)"
                    value={adminMessage}
                    onChangeText={setAdminMessage}
                    multiline
                    style={[styles.actionInput, { backgroundColor: colors.iconBackground, color: colors.text, borderColor: colors.border }]}
                  />
                )}
                <View style={[styles.modalActions, isDesktop && styles.modalActionsDesktop]}>
                  <TouchableOpacity 
                    style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      if (pendingAction === "promote_admin" && !adminPassword) {
                        return; // Add validation if needed
                      }
                      handleConfirmAction(pendingAction);
                    }}
                  >
                    <Text style={[styles.modalActionBtnText, { color: colors.background }]}>
                      {pendingAction === "promote_admin" ? "Verify & Elevate" : "Confirm Action"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.iconBackground }]}
                    onPress={() => {
                      setPendingAction(null);
                      setAdminPassword("");
                    }}
                  >
                    <Text style={[styles.modalActionBtnText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {isVerification && (
                  <View style={[styles.modalActions, isDesktop && styles.modalActionsDesktop]}>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.primary }]}
                      onPress={() => handleActionClick("approve")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: colors.background }]}>Approve Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.iconBackground }]}
                      onPress={() => handleActionClick("request_changes")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: colors.text }]}>Request Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: "#FF3B3020", borderColor: "#FF3B30", borderWidth: 1 }]}
                      onPress={() => handleActionClick("reject")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: "#FF3B30" }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {isReport && (
                  <View style={[styles.modalActions, isDesktop && styles.modalActionsDesktop]}>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: "#FF3B30" }]}
                      onPress={() => handleActionClick("ban")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: "#fff" }]}>Ban User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.iconBackground }]}
                      onPress={() => handleActionClick("warning")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: colors.text }]}>Issue Warning</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {isFeedback && (
                  <View style={[styles.modalActions, isDesktop && styles.modalActionsDesktop]}>
                    <TouchableOpacity 
                      style={[styles.modalActionBtn, isDesktop && styles.modalActionBtnDesktop, { backgroundColor: colors.primary }]}
                      onPress={() => handleActionClick("acknowledge")}
                    >
                      <Text style={[styles.modalActionBtnText, { color: colors.background }]}>Acknowledge</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </>
      );
    };

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <GlassContainer style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            {renderModalContent()}
          </GlassContainer>
        </View>
      </Modal>
    );
  };

  const renderUserManagementView = () => {
    if (!isUserManagementOpen) return null;

    const filteredUsers = MOCK_USERS.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                           user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchesRole = userRoleFilter === "All" || user.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });

    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background, zIndex: 1000 }]}>
        <View style={[styles.managementHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => {
              if (onCloseManagement) onCloseManagement();
              setIsUserManagementOpen(false);
            }} 
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.managementTitle, { color: colors.text }]}>User Directory</Text>
        </View>

        <View style={styles.searchSection}>
          <GlassTextInput
            placeholder="Search by name or email..."
            value={userSearchQuery}
            onChangeText={setUserSearchQuery}
            icon="search"
          />
          <View style={styles.filterRow}>
            {(["All", "Expert", "User"] as const).map((role) => (
              <TouchableOpacity 
                key={role}
                style={[
                  styles.filterChip, 
                  userRoleFilter === role && { backgroundColor: colors.primary }
                ]}
                onPress={() => setUserRoleFilter(role)}
              >
                <Text style={[
                  styles.filterChipText, 
                  { color: userRoleFilter === role ? colors.background : colors.mutedText }
                ]}>
                  {role}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.userListScroll}>
          {filteredUsers.map((user) => (
            <TouchableOpacity 
              key={user.id} 
              style={[styles.userCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => {
                setSelectedItem(user);
                setPendingAction("promote_admin");
                setShowModal(true);
              }}
            >
              <View style={styles.userIcon}>
                <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.userMeta, { color: colors.mutedText }]}>{user.email} • Joined {user.joined}</Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: colors.iconBackground }]}>
                 <Text style={[styles.roleBadgeText, { color: colors.primary }]}>{user.role}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderUserManagementView()}
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[
          styles.content, 
          isDesktop && styles.desktopContent,
          !isDesktop && styles.mobileContent
        ]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
              {/* Moderation Hero & Stats */}
        <View style={[styles.heroContainer, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)', borderColor: colors.border }]}>
          <View style={styles.heroTextRow}>
            <View style={styles.heroTextSection}>
              <Text style={[styles.bannerTitle, { color: colors.text }]}>Moderation Center</Text>
              <Text style={[styles.bannerSub, { color: colors.mutedText }]}>Live system monitoring and quality control</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <View key={stat.id} style={[styles.statChip, { backgroundColor: colors.iconBackground }]}>
                <Ionicons name={stat.icon as any} size={14} color={stat.color} />
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedText }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sticky Tabs */}
        <View style={styles.stickyTabWrapper}>
          <View style={[styles.stickyTabContainer, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)', borderColor: colors.border }]}>
            <View style={[styles.tabSwitcher, { backgroundColor: colors.iconBackground }]}>
              {(["verifications", "reports", "feedback"] as AdminTab[]).map((tab) => {
                const isActive = activeTab === tab;
                const labels = {
                  verifications: "Queue",
                  reports: "Reports",
                  feedback: "Feedback"
                };
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton, 
                      isActive && { backgroundColor: isDark ? '#fff' : '#000' }
                    ]}
                    onPress={() => handleTabChange(tab)}
                  >
                    <Text style={[
                      styles.tabText, 
                      { color: isActive ? (isDark ? '#000' : '#fff') : colors.mutedText }
                    ]}>
                      {labels[tab]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {activeTab === "verifications" && renderVerifications()}
        {activeTab === "reports" && renderReports()}
        {activeTab === "feedback" && renderFeedback()}
      </ScrollView>
      {renderDetailsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    width: "92%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 8,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.08)",
  },
  heroTextSection: {
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.7,
  },
  stickyTabWrapper: {
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingBottom: 25,
  },
  stickyTabContainer: {
    width: "92%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 25,
    borderWidth: 1,
    boxShadow: "0 15 40 rgba(0, 0, 0, 0.12)",
  },
  tabSwitcher: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    marginHorizontal: 2,
  },
 tabButtonActive: {
    // Handled in JSX with backgroundColor
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    // Handled in JSX with color
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 0, 
    paddingBottom: 120,
  },
  mobileContent: {
    paddingBottom: 140, 
  },
  desktopContent: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
    paddingTop: 0,
  },
  listContainer: {
    gap: 20,
  },
  itemCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
  },
  itemType: {
    fontSize: 14,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "700",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTime: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  approveBtn: {
    // backgroundColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
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
    maxWidth: 500,
    maxHeight: "80%",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  detailSubValue: {
    fontSize: 14,
    marginTop: 4,
  },
  skillBadgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  detailSkillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailSkillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  priorityBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalFooter: {
    paddingTop: 10,
  },
  modalActions: {
    flexDirection: "column",
    gap: 12,
  },
  modalActionBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  modalActionsDesktop: {
    flexDirection: "row",
  },
  modalActionBtnDesktop: {
    flex: 1,
  },
  modalActionBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  statusIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 40,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  statusSub: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionMessageContainer: {
    width: "100%",
    paddingTop: 10,
  },
  actionPromptText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  actionInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
    marginBottom: 15,
  },
  heroTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  menuIconButton: {
    padding: 10,
    borderRadius: 12,
  },
  adminDropDown: {
    position: 'absolute',
    top: 70,
    right: 22,
    width: 200,
    borderRadius: 20,
    padding: 10,
    zIndex: 100,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.15)",
  },
  dropDownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  dropDownText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dropDownDivider: {
    height: 1,
    marginVertical: 4,
  },
  managementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 15,
  },
  managementTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  searchSection: {
    padding: 20,
    gap: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  userListScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  userIcon: {
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  userMeta: {
    fontSize: 13,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  passwordChallenge: {
    marginBottom: 20,
  },
  challengeSub: {
    fontSize: 13,
    marginBottom: 15,
    lineHeight: 18,
  },
});
