import PeopleView from "@/components/PeopleView";
import ProfileEditorView from "@/components/ProfileEditorView";
import ProfileView from "@/components/ProfileView";
import SearchView from "@/components/SearchView";
import SettingsView from "@/components/SettingsView";
import NotificationsView from "@/components/NotificationsView";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLogo from "../components/AppLogo";
import ChatView from "../components/ChatView";
import { useTheme } from "../context/ThemeContext";

interface CardData {
  id: string;
  type: "skill" | "product";
  title: string;
  author: string;
  price?: string;
  rating: number;
  image: string;
  description: string;
}

const SAMPLE_DATA: CardData[] = [
  {
    id: "1",
    type: "skill",
    title: "UI/UX Design Studio",
    author: "Sarah Jenkins",
    rating: 4.9,
    description: "I help early-stage startups build their first digital products with high-end minimal design.",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    type: "product",
    title: "Mechanical Keyboard Pro",
    author: "Alex Rivera",
    price: "$189",
    rating: 4.8,
    description: "Custom-built mechanical keyboard with silent switches and black-on-white keycaps.",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    type: "skill",
    title: "Fullstack Development",
    author: "David Chen",
    rating: 5.0,
    description: "React Native specialist available for building scalable mobile applications.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
];

function ContentCard({ data, isDesktop }: { data: CardData; isDesktop: boolean }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.card, isDesktop && styles.desktopCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.background }]}>{data.type === "skill" ? "SKILL" : "PRODUCT"}</Text>
        </View>
        <Ionicons name="heart-outline" size={20} color={colors.text} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.cardAuthor, { color: colors.secondaryText }]}>by {data.author}</Text>
        <Text style={[styles.cardDescription, { color: colors.mutedText }]} numberOfLines={2}>{data.description}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color={colors.text} />
          <Text style={[styles.ratingText, { color: colors.text }]}>{data.rating}</Text>
        </View>
        {data.price && <Text style={[styles.priceText, { color: colors.text }]}>{data.price}</Text>}
        <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.viewButtonText, { color: colors.background }]}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FeedScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const isDesktop = width >= 768;
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileEditorActive, setIsProfileEditorActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);

  useEffect(() => {
    if (activeTab !== "profile") {
      setIsSettingsActive(false);
    }
    setIsSearchActive(false);
    setIsProfileEditorActive(false);
    setIsNotificationsActive(false);
  }, [activeTab]);

  const renderLogo = () => (
    <View style={styles.logoBox}>
      <AppLogo />
    </View>
  );

  const renderTopBar = () => {
    const isInSettings = activeTab === "settings" || (activeTab === "profile" && isSettingsActive);
    let title: React.ReactNode = "Your Feed";
    if (isSearchActive) title = "Search";
    else if (isProfileEditorActive) title = "Profile Editor";
    else if (isNotificationsActive) title = "Notifications";
    else if (activeTab === "chat") title = "Chats";
    else if (activeTab === "discover") {
      title = (
        <View style={styles.stackedTitleContainer}>
          <Text style={[styles.stackedTitleText, { color: colors.text }]}>People</Text>
        </View>
      );
    }
    else if (activeTab === "profile") title = isSettingsActive ? "Settings" : "Profile";
    else if (activeTab === "settings") title = "Settings";

    return (
      <View style={[styles.topBar, !isDesktop && styles.topBarMobile, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {((isInSettings || (isSearchActive && !isDesktop) || isProfileEditorActive || (isNotificationsActive && !isDesktop)) && !isDesktop) ? (
          <TouchableOpacity 
            style={styles.backButtonContainer} 
            onPress={() => {
              if (isSearchActive) setIsSearchActive(false);
              else if (isProfileEditorActive) setIsProfileEditorActive(false);
              else if (isNotificationsActive) setIsNotificationsActive(false);
              else if (activeTab === "settings") setActiveTab("home");
              else setIsSettingsActive(false);
            }}
          >
            <View style={[styles.backButtonCircle, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        ) : renderLogo()}
        <View style={styles.topBarTitleContainer}>
          {typeof title === "string" ? (
            <Text style={[styles.topBarTitle, { color: colors.text }]}>{title}</Text>
          ) : (
            title
          )}
        </View>
        {!isInSettings && !isSearchActive && !isProfileEditorActive && !isNotificationsActive && (
          <View style={styles.utilitySection}>
            <View style={styles.topIcons}>
              {activeTab !== "chat" && (activeTab !== "profile" || !isDesktop) && (
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      if (activeTab === "profile") {
                        setIsSettingsActive(true);
                      } else {
                        setIsSearchActive(!isSearchActive);
                      }
                    }}
                  >
                    <Ionicons
                      name={activeTab === "profile" ? "settings-outline" : "search-outline"}
                      size={28}
                      color={colors.text}
                    />
                  </TouchableOpacity>
              )}
              {activeTab === "chat" && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setActiveTab("discover")}
                >
                  <Ionicons name="people-outline" size={28} color={colors.text} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setIsNotificationsActive(!isNotificationsActive)}
              >
                <Ionicons 
                  name={isNotificationsActive ? "notifications" : "notifications-outline"} 
                  size={28} 
                  color={colors.text} 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {(isInSettings || isSearchActive || isNotificationsActive) && (
          <View style={styles.utilitySection}>
            {isDesktop && (isSearchActive || isNotificationsActive) && (
              <TouchableOpacity 
                style={[styles.iconButton, { marginRight: 20 }]}
                onPress={() => {
                  setIsSearchActive(false);
                  setIsNotificationsActive(false);
                }}
              >
                <Ionicons name="close-outline" size={32} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderNavItem = (name: string, icon: any, label: string) => {
    const isActive = activeTab === name;
    return (
      <TouchableOpacity 
        key={name} 
        style={[
          isDesktop ? styles.sideNavItem : styles.bottomNavItem,
          !isDesktop && isActive && styles.bottomNavItemActive
        ]}
        onPress={() => setActiveTab(name)}
      >
        <View style={[styles.navIconContainer, !isDesktop && isActive && styles.navIconContainerActive, { backgroundColor: isActive ? colors.primary : 'transparent' }]}>
          <Ionicons name={isActive ? icon.replace("-outline", "") : icon} size={24} color={isActive ? colors.background : colors.mutedText} />
        </View>
        {(isDesktop || isActive) && (
          <Text style={[
            isDesktop ? styles.sideNavLink : styles.bottomNavLabel,
            isActive && !isDesktop && styles.bottomNavLabelActive,
            { color: isActive ? colors.text : colors.mutedText }
          ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const navItems = [
    { name: "home", icon: "home-outline", label: "Home" },
    { name: "chat", icon: "chatbubble-outline", label: "Chat" },
    { name: "discover", icon: "compass-outline", label: "People" },
    { name: "profile", icon: "person-outline", label: "Profile" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Desktop Sidebar */}
        {isDesktop && (
          <View style={[styles.sidebar, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.sidebarContent}>
              <Text style={[styles.sidebarTitle, { color: colors.mutedText }]}>Menu</Text>
              {navItems.map(item => renderNavItem(item.name, item.icon, item.label))}
              <View style={[styles.sidebarDivider, { backgroundColor: colors.border }]} />
              {renderNavItem("settings", "settings-outline", "Settings")}
            </View>
          </View>
        )}

        <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
          {(!isDesktop && activeTab === "chat" && isMobileChatActive) ? null : renderTopBar()}
          
          {isSearchActive ? (
            <SearchView isDesktop={isDesktop} onBack={() => setIsSearchActive(false)} />
          ) : isNotificationsActive ? (
            <NotificationsView isDesktop={isDesktop} />
          ) : isProfileEditorActive ? (
            <ProfileEditorView isDesktop={isDesktop} onBack={() => setIsProfileEditorActive(false)} />
          ) : (
            <>
              {activeTab === "home" && (
                <ScrollView 
                  style={styles.feedScroll}
                  contentContainerStyle={styles.feedContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={isDesktop ? styles.desktopGrid : styles.mobileList}>
                    {SAMPLE_DATA.map(item => (
                      <ContentCard key={item.id} data={item} isDesktop={isDesktop} />
                    ))}
                  </View>
                </ScrollView>
              )}

              {activeTab === "chat" && (
                <ChatView 
                  isDesktop={isDesktop} 
                  onActiveChatChange={setIsMobileChatActive} 
                />
              )}

              {activeTab === "discover" && (
                <PeopleView isDesktop={isDesktop} onEditProfile={() => setIsProfileEditorActive(true)} />
              )}

              {activeTab === "profile" && (
                isSettingsActive ? (
                  <SettingsView isDesktop={isDesktop} onBack={() => setIsSettingsActive(false)} />
                ) : (
                  <ProfileView isDesktop={isDesktop} />
                )
              )}

              {activeTab === "settings" && (
                <SettingsView isDesktop={isDesktop} onBack={() => setActiveTab("home")} />
              )}

              {/* Mobile Bottom Nav */}
              {(!isDesktop && 
                ["home", "chat", "discover", "profile"].includes(activeTab) && 
                !(activeTab === "chat" && isMobileChatActive) && 
                !isSettingsActive && !isProfileEditorActive) && (
                <>
                  <LinearGradient
                    colors={['transparent', isDark ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)']}
                    style={styles.footerTranslucent}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.15 }}
                  />
                  <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    {navItems.map(item => renderNavItem(item.name, item.icon, item.label))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  sidebarContent: {
    padding: 20,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 1,
  },
  sideNavItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  sideNavLink: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
    color: "#000",
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    height: 90,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 100,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  topBarMobile: {
    height: 70,
  },
  topBarTitleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    letterSpacing: -0.5,
  },
  stackedTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  stackedTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    lineHeight: 20,
  },
  stackedTitleAmp: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    lineHeight: 14,
    marginVertical: 1,
  },
  logoBox: {
    width: 120,
    borderRightWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: "100%",
  },
  backButtonContainer: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  utilitySection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  topIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 25,
  },
  feedScroll: {
    flex: 1,
  },
  feedContainer: {
    padding: 25,
    paddingBottom: 140, // Space for floating bottom nav
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  feedHeader: {
    marginBottom: 30,
  },
  feedTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
  },
  feedSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    width: "100%",
  },
  mobileList: {
    gap: 20,
  },
  desktopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  desktopCard: {
    width: "48%",
    minWidth: 300,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#333",
  },
  cardContent: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#f5f5f5",
    paddingTop: 15,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    flex: 1,
  },
  viewButton: {
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomNav: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 75,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 5 : 0,
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
    elevation: 15,
  },
  footerTranslucent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Exactly matches top of navbar (bottom 25 + height 75)
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
    height: "100%",
  },
  bottomNavItemActive: {
    // Add specific styles if needed for the container
  },
  navIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: "#f0f0f0",
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  bottomNavLabelActive: {
    color: "#000",
    fontWeight: "700",
  },
});
