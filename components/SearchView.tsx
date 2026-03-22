import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface SearchViewProps {
  isDesktop: boolean;
  onBack: () => void;
}

const CATEGORIES = ["All", "People", "Skills", "Posts"];

export default function SearchView({ isDesktop, onBack }: SearchViewProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
          isDesktop && { height: 50, borderRadius: 12 }
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
          {searchQuery.length > 0 && (
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
        isDesktop && { paddingHorizontal: 20, borderBottomWidth: 0, marginTop: 10 }
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
                  isDesktop && { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: isActive ? colors.background : colors.text },
                  isDesktop && { fontSize: 15 }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Results Area */}
      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {searchQuery.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={colors.mutedText} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Search PUConnect</Text>
            <Text style={[styles.emptyStateSub, { color: colors.mutedText }]}>Find people and skills.</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateSub, { color: colors.mutedText }]}>No results found for &quot;{searchQuery}&quot; in {activeCategory}.</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 15,
  },
});
