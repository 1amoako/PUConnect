import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AppLogo from "../components/AppLogo";
import ChatView from "../components/ChatView";

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
  return (
    <TouchableOpacity style={[styles.card, isDesktop && styles.desktopCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{data.type === "skill" ? "SKILL" : "PRODUCT"}</Text>
        </View>
        <Ionicons name="heart-outline" size={20} color="#000" />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{data.title}</Text>
        <Text style={styles.cardAuthor}>by {data.author}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{data.description}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color="#000" />
          <Text style={styles.ratingText}>{data.rating}</Text>
        </View>
        {data.price && <Text style={styles.priceText}>{data.price}</Text>}
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function FeedScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [activeTab, setActiveTab] = useState("home");

  const renderLogo = () => (
    <View style={styles.logoBox}>
      <AppLogo />
    </View>
  );

  const renderTopBar = () => (
    <View style={styles.topBar}>
      {renderLogo()}
      <View style={styles.utilitySection}>
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
        <View style={[styles.navIconContainer, !isDesktop && isActive && styles.navIconContainerActive]}>
          <Ionicons name={isActive ? icon.replace("-outline", "") : icon} size={24} color={isActive ? "#000" : "#444"} />
        </View>
        {(isDesktop || isActive) && (
          <Text style={[
            isDesktop ? styles.sideNavLink : styles.bottomNavLabel,
            isActive && !isDesktop && styles.bottomNavLabelActive
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
    { name: "discover", icon: "compass-outline", label: "Discover" },
    { name: "profile", icon: "person-outline", label: "Profile" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Desktop Sidebar */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarContent}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              {navItems.map(item => renderNavItem(item.name, item.icon, item.label))}
              <View style={styles.sidebarDivider} />
              {renderNavItem("settings", "settings-outline", "Settings")}
            </View>
          </View>
        )}

        <View style={styles.mainContent}>
          {renderTopBar()}
          
          {activeTab === "home" && (
            <ScrollView 
              style={styles.feedScroll}
              contentContainerStyle={styles.feedContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.feedHeader}>
                <Text style={styles.feedTitle}>Your Feed</Text>
                <Text style={styles.feedSubtitle}>Discover skills and products around you</Text>
              </View>

              <View style={isDesktop ? styles.desktopGrid : styles.mobileList}>
                {SAMPLE_DATA.map(item => (
                  <ContentCard key={item.id} data={item} isDesktop={isDesktop} />
                ))}
              </View>
            </ScrollView>
          )}

          {activeTab === "chat" && (
            <ChatView isDesktop={isDesktop} />
          )}

          {/* Mobile Bottom Nav */}
          {!isDesktop && (
            <>
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.8)']}
                style={styles.footerTranslucent}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.15 }}
              />
              <View style={styles.bottomNav}>
                {navItems.map(item => renderNavItem(item.name, item.icon, item.label))}
              </View>
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
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 100,
  },
  logoBox: {
    width: 120,
    borderRightWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
    paddingBottom: 120, // Space for floating bottom nav
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
