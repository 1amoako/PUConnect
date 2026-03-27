import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";

interface SearchViewProps {
  isDesktop: boolean;
  onBack: () => void;
}

const CATEGORIES = ["All", "Experts", "Gigs", "Posts"];
const TRENDING_SEARCHES = ["React Native", "UI Design", "Python Tutor", "Logo Design", "Graphic Design"];
const RECENT_SEARCHES = ["Software Engineer", "Interior Design", "SEO Audit"];

export default function SearchView({ isDesktop, onBack }: SearchViewProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsTyping(true);
      const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        setIsTyping(false);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      setDebouncedQuery("");
      setIsTyping(false);
    }
  }, [searchQuery]);

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  const renderSearchItem = (item: string, icon: any = "time-outline") => (
    <TouchableOpacity 
      key={item} 
      style={[styles.searchItem, { borderBottomColor: colors.border }]}
      onPress={() => setSearchQuery(item)}
    >
      <View style={styles.searchItemLeft}>
        <Ionicons name={icon} size={20} color={colors.mutedText} />
        <Text style={[styles.searchItemText, { color: colors.text }]}>{item}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[
        styles.header, 
        { borderBottomColor: colors.border },
        isDesktop && { paddingHorizontal: 20, paddingTop: 20, borderBottomWidth: 0 }
      ]}>
        <View style={[
          styles.searchBox, 
          { backgroundColor: colors.iconBackground, borderColor: colors.border },
          isDesktop && { height: 55, borderRadius: 16 }
        ]}>
          <Ionicons name="search-outline" size={isDesktop ? 24 : 20} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }, isDesktop && { fontSize: 18 }]}
            placeholder="Search PUConnect..."
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {isTyping ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 5 }} />
          ) : searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={isDesktop ? 24 : 20} color={colors.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={[
        styles.categoriesContainer, 
        { borderBottomColor: colors.border },
        isDesktop && { paddingHorizontal: 20, borderBottomWidth: 0, marginTop: 15 }
      ]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  { backgroundColor: isActive ? colors.primary : colors.iconBackground, borderColor: colors.border },
                  isDesktop && { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 }
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: isActive ? colors.background : colors.text },
                  isDesktop && { fontSize: 16 }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results / Empty State */}
      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {searchQuery.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(400)}>
            {RECENT_SEARCHES.length > 0 && (
              <View style={styles.sectionContainer}>
                {renderSectionHeader("Recent Searches")}
                {RECENT_SEARCHES.map((item) => renderSearchItem(item))}
              </View>
            )}

            <View style={styles.sectionContainer}>
              {renderSectionHeader("Trending Now")}
              {TRENDING_SEARCHES.map((item) => renderSearchItem(item, "trending-up-outline"))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            {isTyping ? (
              <Text style={[styles.emptyStateSub, { color: colors.mutedText }]}>Searching for &quot;{searchQuery}&quot;...</Text>
            ) : (
              <>
                <Ionicons name="search-outline" size={48} color={colors.mutedText} />
                <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Results</Text>
                <Text style={[styles.emptyStateSub, { color: colors.mutedText }]}>
                  We couldn&apos;t find anything for &quot;{debouncedQuery}&quot; in {activeCategory}.
                </Text>
              </>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 25,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "700",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  searchItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  searchItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSub: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
