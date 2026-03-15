import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PeopleAndProductsViewProps {
  isDesktop: boolean;
}

type SubTab = "people" | "products" | "me";

interface UserProfile {
  id: string;
  name: string;
  status: string;
  skills: string[];
}

interface UserProfile {
  id: string;
  name: string;
  status: string;
  skills: string[];
}

interface ProductItem {
  id: string;
  title: string;
  author: string;
  description: string;
  price: string;
}

const MOCK_PROFILES: UserProfile[] = [
  { id: "p1", name: "Alice Cooper", status: "Looking for freelance mobile work.", skills: ["React Native", "UI/UX", "Figma"] },
  { id: "p2", name: "David Chen", status: "Available for full-stack contracts.", skills: ["Node.js", "React", "PostgreSQL"] },
  { id: "p3", name: "Sarah Jenkins", status: "Open to new design opportunities.", skills: ["Graphic Design", "Branding", "Illustration"] },
];

const MOCK_PRODUCTS: ProductItem[] = [
  { id: "pr1", title: "Minimalist UI Kit", author: "Sarah Jenkins", description: "A comprehensive Figma UI kit adhering strictly to black and white minimalist principles.", price: "$49" },
  { id: "pr2", title: "React Native Boilerplate", author: "David Chen", description: "Production-ready boilerplate with auth, navigation, and API layers pre-configured.", price: "$29" },
  { id: "pr3", title: "Custom Icon Set", author: "Alice Cooper", description: "200+ custom vector icons designed for high-contrast interfaces.", price: "$19" },
];

const MY_PROFILE: UserProfile | null = { id: "me1", name: "Jacob Zero", status: "Looking for new projects.", skills: ["React Native", "TypeScript", "UI Design"] };
const MY_PRODUCTS: ProductItem[] = [
  { id: "mypr1", title: "Personal Website Template", author: "Jacob Zero", description: "A high-performance personal portfolio template built with Next.js.", price: "$15" }
];

export default function PeopleAndProductsView({ isDesktop }: PeopleAndProductsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("people");

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>
        Find skilled people to assist you and the best Products right now!
      </Text>
      <View style={styles.tabSwitcher}>
        {(["people", "products", "me"] as SubTab[]).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveSubTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderProfileCard = (profile: UserProfile) => (
    <View key={profile.id} style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileStatus}>{profile.status}</Text>
        </View>
      </View>
      <View style={styles.skillsContainer}>
        {profile.skills.map((skill, index) => (
          <View key={index} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPeopleTab = () => (
    <View style={styles.tabContent}>
      {MOCK_PROFILES.map(renderProfileCard)}
      
      {/* Absolute floating button specifically for People tab */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="person-add-outline" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Create Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductCard = (product: ProductItem, isMyProduct: boolean = false) => (
    <View key={product.id} style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>PRODUCT</Text>
        </View>
        <Ionicons name="bookmark-outline" size={20} color="#000" />
      </View>
      <View style={styles.productContent}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productAuthor}>by {product.author}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>{product.price}</Text>
        <TouchableOpacity style={isMyProduct ? styles.editButton : styles.viewButton}>
          <Text style={isMyProduct ? styles.editButtonText : styles.viewButtonText}>
            {isMyProduct ? "Edit" : "View"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProductsTab = () => (
    <View style={styles.tabContent}>
      {MOCK_PRODUCTS.map(p => renderProductCard(p, false))}
      
      {/* Absolute floating button specifically for Products tab */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setActiveSubTab("me")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>List Product</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMeTab = () => {
    const hasProfile = MY_PROFILE !== null;
    const hasProducts = MY_PRODUCTS.length > 0;
    const isEmpty = !hasProfile && !hasProducts;

    return (
      <View style={styles.tabContent}>
        {isEmpty ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Nothing here yet</Text>
            <Text style={styles.emptyStateSub}>Create a profile or list a product to get started.</Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {hasProfile && MY_PROFILE && (
              <View style={styles.meSection}>
                <Text style={styles.sectionTitle}>My Profile</Text>
                {renderProfileCard(MY_PROFILE)}
              </View>
            )}
            
            {hasProducts && (
              <View style={styles.meSection}>
                <Text style={styles.sectionTitle}>My Products</Text>
                {MY_PRODUCTS.map(p => renderProductCard(p, true))}
              </View>
            )}
            
            <TouchableOpacity style={styles.floatingButton}>
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.floatingButtonText}>Manage</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBanner()}
      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSubTab === "people" && renderPeopleTab()}
        {activeSubTab === "products" && renderProductsTab()}
        {activeSubTab === "me" && renderMeTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
    // Add shadow to make it appear floating over scrolling content
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
    elevation: 5,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    lineHeight: 22,
    marginBottom: 15,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for bottom nav/FABs
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  tabContent: {
    flex: 1,
    minHeight: "100%", // Ensures absolute button has space to float
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 0,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
    elevation: 10,
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#333",
  },
  productContent: {
    marginBottom: 15,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  productAuthor: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#f5f5f5",
    paddingTop: 15,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
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
  editButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  editButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  emptyStateButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  meSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
    marginLeft: 5,
  },
});
