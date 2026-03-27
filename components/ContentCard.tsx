import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export interface CardData {
  id: string;
  type: "skill" | "request";
  title: string;
  author: string;
  price?: string;
  image: string;
  description: string;
}

export const SAMPLE_DATA: CardData[] = [
  {
    id: "1",
    type: "skill",
    title: "UI/UX Design Studio",
    author: "Sarah Jenkins",
    description: "I help early-stage startups build their first digital services with high-end minimal design.",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    type: "request",
    title: "Need a React Native Developer",
    author: "Startup Inc",
    description: "Looking for an experienced dev to help finish our MVP. Budget flexible.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    price: "$50-$100/hr"
  },
  {
    id: "3",
    type: "skill",
    title: "Fullstack Development",
    author: "David Chen",
    description: "React Native specialist available for building scalable mobile applications.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    type: "request",
    title: "Logo Design for Bakery",
    author: "Sweet Treats",
    description: "Need a rustic logo for my new organic bakery. Willing to pay upfront.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    price: "$200"
  },
  {
    id: "5",
    type: "skill",
    title: "Social Media Manager",
    author: "Mia Wong",
    description: "I grow Instagram accounts from 0 to 10k followers using organic strategies.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    type: "request",
    title: "Python Tutor Needed",
    author: "James Miller",
    description: "College student looking for someone to explain Data Science fundamentals.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    price: "$30/hr"
  },
  {
    id: "7",
    type: "skill",
    title: "Professional Translation",
    author: "Luigi Rossi",
    description: "Italian to English technical translation. 10 years experience in engineering docs.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "8",
    type: "request",
    title: "Wedding Photographer",
    author: "The Johnsons",
    description: "Looking for a candid photographer for a small garden wedding in June.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    price: "$1500"
  },
  {
    id: "9",
    type: "skill",
    title: "SEO Audit Specialist",
    author: "Kevin Patel",
    description: "Get a comprehensive report on why your website isn't ranking on Google.",
    image: "https://images.unsplash.com/photo-1571721795195-a2cb2d33e00d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "10",
    type: "request",
    title: "Interior Design Consultation",
    author: "Modern Living",
    description: "Need help choosing furniture and colors for a 2-bedroom apartment.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    price: "$100/session"
  },
  {
    id: "11",
    type: "skill",
    title: "Cyber Security Expert",
    author: "Alex Rivera",
    description: "Penetration testing and vulnerability assessment for small businesses.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "12",
    type: "request",
    title: "App Video Ad Creation",
    author: "AppDev Team",
    description: "Need a 30-second animated video for our new fitness app. Assets provided.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    price: "$500"
  },
];

interface ContentCardProps {
  data: CardData;
  isDesktop: boolean;
  onPress?: () => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ContentCard({ data, isDesktop, onPress, isOwner, onEdit, onDelete }: ContentCardProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.card, isDesktop && styles.desktopCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: data.type === 'skill' ? colors.primary : colors.iconBackground }]}>
          <Text style={[styles.badgeText, { color: data.type === 'skill' ? colors.background : colors.text }]}>
            {data.type === 'skill' ? 'SKILL' : 'REQUEST'}
          </Text>
        </View>
        <Ionicons name="heart-outline" size={20} color={colors.text} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.cardAuthor, { color: colors.secondaryText }]}>by {data.author}</Text>
        <Text style={[styles.cardDescription, { color: colors.mutedText }]} numberOfLines={2}>{data.description}</Text>
      </View>

      <View style={styles.cardFooter}>
        {data.price && <Text style={[styles.priceText, { color: colors.text }]}>{data.price}</Text>}
        <View style={styles.footerActions}>
          {isOwner && (
            <TouchableOpacity 
              style={[styles.deleteButton, { borderColor: colors.danger + '33' }]}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.viewButton, { backgroundColor: isOwner ? colors.text : colors.primary }]}
            onPress={isOwner ? onEdit : undefined}
          >
            <Text style={[styles.viewButtonText, { color: colors.background }]}>
              {isOwner ? "Edit" : "View"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    width: "100%",
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
  footerActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
