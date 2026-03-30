import AdminDashboard from "@/components/AdminDashboard";
import AdminReviewView from "@/components/AdminReviewView";
import AdEditorModal from "@/components/AdEditorModal";
import NotificationsView, { NotificationItem } from "@/components/NotificationsView";
import PeopleView from "@/components/PeopleView";
import ProfileEditorView from "@/components/ProfileEditorView";
import ProfileView from "@/components/ProfileView";
import PublicProfileView, { PublicProfileData } from "@/components/PublicProfileView";
import SearchView from "@/components/SearchView";
import SettingsView from "@/components/SettingsView";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring 
} from "react-native-reanimated";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AppLogo from "../components/AppLogo";
import ChatView from "../components/ChatView";
import { useTheme } from "../context/ThemeContext";
import ContentCard, { CardData, SAMPLE_DATA } from "@/components/ContentCard";

export type ExpertStatus = 'none' | 'pending' | 'approved';

export interface UserProfile {
  name: string;
  handle: string;
  joined: string;
  avatar?: string;
  expertStatus: ExpertStatus;
  expertProfile?: {
    description: string;
    skills: string[];
  };
  pendingExpertData?: {
    description: string;
    skills: string[];
  };
  contact?: string;
  ads: any[];
  requests: any[];
}

export default function FeedScreen() {

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { role } = useLocalSearchParams();
  const isAdmin = role === "admin";
  const { colors, isDark } = useTheme();
  const isDesktop = width >= 768;
  const [activeTab, setActiveTab] = useState("home");
  const [feedTab, setFeedTab] = useState<"skill" | "request">("skill");
  
  // Phase 1: Central User State (UU by default)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: "Jacob Zero",
    handle: "@jacobzero",
    joined: "March 2024",
    expertStatus: 'none',
    ads: [
      { id: "sa1", type: "skill", title: "Professional Tutoring", author: "Jacob Zero", description: "I teach Python and React Native for beginners. 5 years experience.", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80", status: 'approved' },
    ],
    requests: [
      { id: "sr1", type: "request", title: "Need help with a logo", author: "Jacob Zero", description: "Looking for a minimal logo for a startup. Budget $200.", price: "$200", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80", status: 'approved' },
    ]
  });

  const [isMobileChatActive, setIsMobileChatActive] = useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isProfileEditorActive, setIsProfileEditorActive] = useState(false);
  const [editorMode, setEditorMode] = useState<'identity' | 'expert' | 'both'>('both');
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isAdminReviewActive, setIsAdminReviewActive] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PublicProfileData | null>(null);
  const [directChatId, setDirectChatId] = useState<string | null>(null);
  const [chatActivityContext, setChatActivityContext] = useState<CardData | null>(null);

  // Ad Editor State
  const [isAdEditorActive, setIsAdEditorActive] = useState(false);
  const [adEditorType, setAdEditorType] = useState<'skill' | 'request'>('skill');
  const [adToEdit, setAdToEdit] = useState<any>(null);
  const activeTabX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const [tabLayouts, setTabLayouts] = useState<{[key: string]: {x: number, width: number}}>({});

  // Mock Notification Counts
  const unreadChatsCount = 1;
  const unreadNotificationsCount = 2;
  const pendingAdminCount = currentUser.expertStatus === 'pending' ? 1 : 3; // Mocking 3 generic admin issues if not pending

  const navItems = [
    { name: "home", icon: "home-outline", label: "Home" },
    { name: "chat", icon: "chatbubble-outline", label: "Chat", badge: unreadChatsCount },
    ...(isAdmin ? [{ name: "admin", icon: "shield-checkmark-outline", label: "Admin", badge: pendingAdminCount }] : []),
    { name: "discover", icon: "compass-outline", label: "People" },
    { name: "profile", icon: "person-outline", label: "Me" },
  ];

  useEffect(() => {
    const layout = tabLayouts[activeTab];
    if (layout) {
        activeTabX.value = withSpring(layout.x);
        indicatorWidth.value = withSpring(layout.width);
    }
  }, [activeTab, tabLayouts, activeTabX, indicatorWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeTabX.value }],
      width: indicatorWidth.value,
    };
  });

  useEffect(() => {
    if (activeTab !== "profile") {
      setIsSettingsActive(false);
    }
    if (activeTab !== "chat") {
      setDirectChatId(null);
    }
    setIsSearchActive(false);
    setIsProfileEditorActive(false);
    setIsNotificationsActive(false);
    setIsAdminReviewActive(false);
    setSelectedProfile(null);
    setIsAdEditorActive(false);
  }, [activeTab]);

  const handleProfileClick = (item: string | CardData) => {
    const profileId = typeof item === 'string' ? item : item.id;
    if (typeof item !== 'string') {
      setChatActivityContext(item);
    } else {
      setChatActivityContext(null);
    }

    // In a real app, you'd fetch the profile data here. 
    // For now, we'll mock it based on the person clicked.
    const mockProfile: PublicProfileData = {
      id: profileId,
      name: profileId === "1" ? "Sarah Jenkins" : "David Chen",
      handle: profileId === "1" ? "sjenkins" : "dchen",
      description: profileId === "1" 
        ? "I help early-stage startups build their first digital services with high-end minimal design. Over 5 years of experience in mobile and web design."
        : "React Native specialist available for building scalable mobile applications. Passionate about clean code and performance.",
      skills: profileId === "1" ? ["UI Design", "UX Research", "Figma", "Branding"] : ["React Native", "TypeScript", "Firebase", "Node.js"],
      contact: "+1 (555) 123-4567",
      image: profileId === "1" 
        ? "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    };
    setSelectedProfile(mockProfile);
  };

  const handleChatFromProfile = (profileId: string) => {
    setSelectedProfile(null);
    setDirectChatId(profileId);
    setActiveTab("chat");
  };

  const handleNotificationPress = (item: NotificationItem) => {
    setIsNotificationsActive(false);

    if (item.actionPath === '/chat') {
      if (item.relatedEntityId) {
        setDirectChatId(item.relatedEntityId);
      }
      setActiveTab('chat');
    } else if (item.actionPath === '/profile') {
      if (item.relatedEntityId) {
        handleProfileClick(item.relatedEntityId);
      } else {
        setSelectedProfile(null);
        setActiveTab('profile'); 
      }
    } else if (item.actionPath === '/discover') {
      setActiveTab('discover');
    } else if (item.actionTab) {
      setActiveTab(item.actionTab);
    }
  };

  const handleSaveAdOrRequest = (data: any) => {
    const isEdit = !!adToEdit;
    const newItem = {
      ...data,
      id: isEdit ? adToEdit.id : Math.random().toString(36).substr(2, 9),
      author: currentUser.name,
      image: data.image || (data.type === 'skill' 
        ? "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=400&q=80" 
        : "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=400&q=80")
    };

    setCurrentUser(prev => {
      if (data.type === 'skill') {
        const newAds = isEdit 
          ? prev.ads.map(ad => ad.id === adToEdit.id ? newItem : ad)
          : [newItem, ...prev.ads];
        return { ...prev, ads: newAds };
      } else {
        const newReqs = isEdit 
          ? prev.requests.map(req => req.id === adToEdit.id ? newItem : req)
          : [newItem, ...prev.requests];
        return { ...prev, requests: newReqs };
      }
    });

    setIsAdEditorActive(false);
    setAdToEdit(null);
  };

  const renderLogo = () => (
    <View style={styles.logoBox}>
      <AppLogo />
    </View>
  );

  const renderTopBar = () => {
    const isInSettings = activeTab === "settings" || (activeTab === "profile" && isSettingsActive);
    let title: React.ReactNode = "Your Feed";
    if (selectedProfile) title = selectedProfile.name;
    else if (isSearchActive) title = "Search";
    else if (isNotificationsActive) title = "Notifications";
    else if (isAdminReviewActive) title = "Review Center";
    else if (activeTab === "admin") title = "Admin Panel";
    else if (activeTab === "chat") title = "Chats";
    else if (activeTab === "discover") {
      title = (
        <View style={styles.stackedTitleContainer}>
          <Text style={[styles.stackedTitleText, { color: colors.text }]}>People</Text>
        </View>
      );
    }
    else if (activeTab === "profile") title = isSettingsActive ? "Settings" : "Me";
    else if (activeTab === "settings") title = "Settings";

    return (
      <View style={[styles.topBar, !isDesktop && styles.topBarMobile, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        {((isInSettings || (isSearchActive && !isDesktop) || (isNotificationsActive && !isDesktop) || selectedProfile || (isAdminReviewActive && !isDesktop)) && !isDesktop) ? (
          <TouchableOpacity 
            style={styles.backButtonContainer} 
            onPress={() => {
              if (selectedProfile) {
                setSelectedProfile(null);
                setChatActivityContext(null);
              }
              else if (isSearchActive) setIsSearchActive(false);
              else if (isNotificationsActive) setIsNotificationsActive(false);
              else if (isAdminReviewActive) setIsAdminReviewActive(false);
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
        {!isInSettings && !isSearchActive && !isNotificationsActive && !selectedProfile && !isAdminReviewActive && activeTab !== "admin" && (
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
                style={[styles.iconButton, { position: 'relative' }]}
                onPress={() => setIsNotificationsActive(!isNotificationsActive)}
              >
                <Ionicons 
                  name={isNotificationsActive ? "notifications" : "notifications-outline"} 
                  size={28} 
                  color={colors.text} 
                />
                {unreadNotificationsCount > 0 && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        {(isInSettings || isSearchActive || isNotificationsActive || selectedProfile || isAdminReviewActive) && (
          <View style={styles.utilitySection}>
            {isDesktop && (isSearchActive || isNotificationsActive || selectedProfile || isAdminReviewActive) && (
              <TouchableOpacity 
                style={[styles.iconButton, { marginRight: 20 }]}
                onPress={() => {
                  setIsSearchActive(false);
                  setIsNotificationsActive(false);
                  setSelectedProfile(null);
                  setIsAdminReviewActive(false);
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

  const renderNavItem = (name: string, icon: any, label: string, badge?: number) => {
    const isActive = activeTab === name;
    const isSpecial = name === "admin";
    const showSpecialStyle = isSpecial && !isDesktop;

    return (
      <TouchableOpacity 
        key={name} 
        activeOpacity={0.7}
        onLayout={(event) => {
            const { x, width } = event.nativeEvent.layout;
            setTabLayouts(prev => ({ ...prev, [name]: { x, width } }));
        }}
        style={[
          isDesktop ? styles.sideNavItem : styles.bottomNavItem,
          isDesktop && isActive && [styles.sideNavItemActive, { backgroundColor: colors.iconBackground }],
        ]}
        onPress={() => setActiveTab(name)}
      >
        <View style={[
          styles.navIconContainer, 
          showSpecialStyle && [styles.specialIconContainer, { backgroundColor: colors.primary }],
          isActive && showSpecialStyle && { 
            borderColor: colors.background, 
            borderWidth: 2,
            boxShadow: `0px 0px 15px ${colors.primary}B3`, // roughly 0.7-0.8 opacity
            elevation: 20
          }
        ]}>
          <Ionicons 
            name={isActive ? icon.replace("-outline", "") : icon} 
            size={showSpecialStyle ? 28 : 24} 
            color={showSpecialStyle ? colors.background : (isActive ? colors.primary : colors.mutedText)} 
          />
          {!!badge && badge > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{badge > 99 ? '99+' : badge}</Text>
            </View>
          )}
        </View>
        {(isDesktop || (isActive && !isSpecial)) && (
          <Text style={[
            isDesktop ? styles.sideNavLink : styles.bottomNavLabel,
            { color: isActive ? (isDesktop ? colors.primary : colors.text) : colors.mutedText }
          ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Desktop Sidebar */}
        {isDesktop && (
          <View style={[styles.sidebar, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.sidebarContent}>
              <Text style={[styles.sidebarTitle, { color: colors.mutedText }]}>Menu</Text>
              {navItems.map(item => renderNavItem(item.name, item.icon, item.label, item.badge))}
              <View style={[styles.sidebarDivider, { backgroundColor: colors.border }]} />
              {renderNavItem("settings", "settings-outline", "Settings")}
            </View>
          </View>
        )}

        <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
          {(!isDesktop && activeTab === "chat" && isMobileChatActive) ? null : renderTopBar()}
          
          {selectedProfile ? (
            <PublicProfileView 
              isDesktop={isDesktop} 
              profile={selectedProfile} 
              onBack={() => setSelectedProfile(null)}
              onChat={handleChatFromProfile}
            />
          ) : isAdminReviewActive ? (
            <AdminReviewView 
              isDesktop={isDesktop} 
              onBack={() => setIsAdminReviewActive(false)} 
            />
          ) : isSearchActive ? (
            <SearchView isDesktop={isDesktop} onBack={() => setIsSearchActive(false)} />
          ) : isNotificationsActive ? (
            <NotificationsView isDesktop={isDesktop} onNotificationPress={handleNotificationPress} />
          ) : (
            <>
              {activeTab === "home" && (
                <View style={styles.feedWrapper}>
                  <ScrollView 
                    style={styles.feedScroll}
                    contentContainerStyle={[styles.feedContainer, { paddingBottom: 140 + insets.bottom }]}
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[1]}
                  >
                    {/* Hero Message (Scrolls away) */}
                    <View style={[styles.heroContainer, { backgroundColor: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)', borderColor: colors.border }]}>
                      <Text style={[styles.bannerText, { color: colors.text }]}>
                        Find expert help or profitable gigs around you!
                      </Text>
                    </View>

                    {/* Sticky Tabs (Locks to top) */}
                    <View style={[styles.stickyTabWrapper, { backgroundColor: 'transparent' }]}>
                      <View style={[styles.stickyTabContainer, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)', borderColor: colors.border }]}>
                        <View style={[styles.tabSwitcher, { backgroundColor: colors.iconBackground }]}>
                          <TouchableOpacity
                            style={[styles.tabButton, feedTab === "skill" && [styles.tabButtonActive, { backgroundColor: colors.primary }]]}
                            onPress={() => setFeedTab("skill")}
                          >
                            <Text style={[styles.tabText, { color: colors.mutedText }, feedTab === "skill" && [styles.tabTextActive, { color: colors.background }]]}>
                              Find Experts
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.tabButton, feedTab === "request" && [styles.tabButtonActive, { backgroundColor: colors.primary }]]}
                            onPress={() => setFeedTab("request")}
                          >
                            <Text style={[styles.tabText, { color: colors.mutedText }, feedTab === "request" && [styles.tabTextActive, { color: colors.background }]]}>
                              Find Gigs
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View style={styles.cardsGrid}>
                      {SAMPLE_DATA.filter(item => item.type === feedTab).map((item) => (
                        <ContentCard 
                          key={item.id} 
                          data={item} 
                          isDesktop={isDesktop} 
                          hideTag={true}
                          onPress={() => handleProfileClick(item)}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {activeTab === "chat" && (
                <ChatView 
                  isDesktop={isDesktop} 
                  onActiveChatChange={setIsMobileChatActive} 
                  initialActiveChat={directChatId}
                  initialContext={chatActivityContext}
                />
              )}

              {activeTab === "discover" && (
                <PeopleView 
                  isDesktop={isDesktop} 
                  onViewMyProfile={() => setActiveTab("profile")} 
                  onProfileClick={handleProfileClick}
                />
              )}

              {activeTab === "admin" && isAdmin && (
                <AdminDashboard 
                  isDesktop={isDesktop} 
                  onReviewAll={() => setIsAdminReviewActive(true)}
                  pendingApplications={currentUser.expertStatus === 'pending' ? [{ id: 'curr', name: currentUser.name }] : []}
                  onApproveExpert={() => {
                    setCurrentUser(prev => ({
                      ...prev,
                      expertStatus: 'approved',
                      expertProfile: prev.pendingExpertData ?? {
                        description: 'Expert profile approved.',
                        skills: []
                      },
                      pendingExpertData: undefined,
                    }));
                  }}
                />
              )}

              {activeTab === "profile" && (
                isSettingsActive ? (
                  <SettingsView isDesktop={isDesktop} onBack={() => setIsSettingsActive(false)} />
                ) : (
                  <ProfileView 
                    isDesktop={isDesktop} 
                    user={currentUser} 
                    onEdit={(mode?: any) => {
                      setEditorMode(mode || 'both');
                      setIsProfileEditorActive(true);
                    }} 
                    onDeleteAd={(id) => {
                      setCurrentUser(prev => ({
                        ...prev,
                        ads: prev.ads.filter(ad => ad.id !== id)
                      }));
                    }}
                    onDeleteRequest={(id) => {
                      setCurrentUser(prev => ({
                        ...prev,
                        requests: prev.requests.filter(req => req.id !== id)
                      }));
                    }}
                    onCreateAd={() => {
                      setAdEditorType('skill');
                      setAdToEdit(null);
                      setIsAdEditorActive(true);
                    }}
                    onCreateRequest={() => {
                      setAdEditorType('request');
                      setAdToEdit(null);
                      setIsAdEditorActive(true);
                    }}
                    onEditAd={(ad) => {
                      setAdEditorType('skill');
                      setAdToEdit(ad);
                      setIsAdEditorActive(true);
                    }}
                    onEditRequest={(req) => {
                      setAdEditorType('request');
                      setAdToEdit(req);
                      setIsAdEditorActive(true);
                    }}
                  />
                )
              )}

              {activeTab === "settings" && (
                <SettingsView isDesktop={isDesktop} onBack={() => setActiveTab("home")} />
              )}

              {/* Mobile Bottom Nav */}
              {(!isDesktop && 
                ["home", "chat", "discover", "profile", "admin"].includes(activeTab) && 
                !(activeTab === "chat" && isMobileChatActive) && 
                !isSettingsActive && !isProfileEditorActive) && (
                <>
                  <LinearGradient
                    colors={['transparent', isDark ? colors.background + 'CC' : colors.background + 'E6', colors.background]}
                    style={[styles.footerTranslucent, { height: 120 + insets.bottom }]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.4 }}
                  />
                  <View style={[styles.bottomNav, { backgroundColor: colors.background + 'B3', borderColor: colors.border, bottom: Math.max(insets.bottom, 10) }]}>
                    <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle, { backgroundColor: colors.primary + '1A' }]} />
                    <View style={styles.bottomNavContent}>
                      {navItems.map(item => renderNavItem(item.name, item.icon, item.label, item.badge))}
                    </View>
                  </View>
                </>
              )}
            </>
          )}

          <ProfileEditorView 
            isVisible={isProfileEditorActive}
            isDesktop={isDesktop} 
            mode={editorMode}
            onBack={() => setIsProfileEditorActive(false)} 
            initialData={{
              name: currentUser.name,
              handle: currentUser.handle,
              description: currentUser.expertProfile?.description || currentUser.pendingExpertData?.description || '',
              skills: currentUser.expertProfile?.skills || currentUser.pendingExpertData?.skills || [],
              contact: currentUser.contact || '',
              avatar: currentUser.avatar,
              expertStatus: currentUser.expertStatus
            }}
            onSave={(data) => {
              setCurrentUser(prev => {
                const updated = {
                  ...prev,
                  name: data.name,
                  handle: data.handle,
                  contact: data.contact,
                  avatar: data.avatar,
                };

                if (data.isExpertActive) {
                  if (prev.expertStatus === 'none') {
                    updated.expertStatus = 'pending';
                    updated.pendingExpertData = {
                      description: data.description,
                      skills: data.skills,
                    };
                  } else {
                    updated.expertProfile = {
                      description: data.description,
                      skills: data.skills,
                    };
                  }
                }
                return updated;
              });
              setIsProfileEditorActive(false);
            }}
          />
        </View>

        <AdEditorModal
          isVisible={isAdEditorActive}
          isDesktop={isDesktop}
          onBack={() => setIsAdEditorActive(false)}
          onSave={handleSaveAdOrRequest}
          type={adEditorType}
          initialData={adToEdit}
        />
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
    paddingHorizontal: 15,
    marginBottom: 8,
    borderRadius: 15,
  },
  sideNavItemActive: {
    // Background color set dynamically
  },
  sideNavLink: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
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
    height: 50,
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
  feedWrapper: {
    flex: 1,
  },
  heroContainer: {
    width: "92%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 8,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.08)",
  },
  stickyTabWrapper: {
    zIndex: 10,
    paddingBottom: 25,
  },
  stickyTabContainer: {
    width: "92%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 30,
    borderWidth: 1,
    boxShadow: "0 15 40 rgba(0, 0, 0, 0.12)",
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 0,
    textAlign: "center",
  },
  tabSwitcher: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  tabButtonActive: {
    // Background color set dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    // Color set dynamically
  },
  feedScroll: {
    flex: 1,
  },
  feedContainer: {
    paddingHorizontal: 25,
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
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  desktopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  bottomNav: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 5 : 0,
    boxShadow: "0 10 30 rgba(0, 0, 0, 0.15)",
    overflow: "visible",
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    height: 44, // Matches standard icon container height
    borderRadius: 22,
    top: 13, // Center vertically (70 - 44 = 26 / 2 = 13)
  },
  footerTranslucent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bottomNavLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
    zIndex: 10,
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  specialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 8 15 rgba(0, 0, 0, 0.25)",
    transform: [{ translateY: -15 }],
  },
});
