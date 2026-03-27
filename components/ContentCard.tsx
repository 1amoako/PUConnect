import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  status?: "pending" | "approved" | "rejected";
}

export const SAMPLE_DATA: CardData[] = [
  {
    id: "1",
    type: "skill",
    title: "UI/UX Design Studio",
    author: "Sarah Jenkins",
    description: "I help early-stage startups build their first digital services with high-end minimal design.",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "2",
    type: "request",
    title: "Need a React Native Developer",
    author: "Startup Inc",
    description: "Looking for an experienced dev to help finish our MVP. Budget flexible.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    price: "$50-$100/hr",
    status: 'approved'
  },
  {
    id: "3",
    type: "skill",
    title: "Fullstack Development",
    author: "David Chen",
    description: "React Native specialist available for building scalable mobile applications.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "4",
    type: "request",
    title: "Logo Design for Bakery",
    author: "Sweet Treats",
    description: "Need a rustic logo for my new organic bakery. Willing to pay upfront.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    price: "$200",
    status: 'approved'
  },
  {
    id: "5",
    type: "skill",
    title: "Social Media Manager",
    author: "Mia Wong",
    description: "I grow Instagram accounts from 0 to 10k followers using organic strategies.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "6",
    type: "request",
    title: "Python Tutor Needed",
    author: "James Miller",
    description: "College student looking for someone to explain Data Science fundamentals.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    price: "$30/hr",
    status: 'approved'
  },
  {
    id: "7",
    type: "skill",
    title: "Professional Translation",
    author: "Luigi Rossi",
    description: "Italian to English technical translation. 10 years experience in engineering docs.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "8",
    type: "request",
    title: "Wedding Photographer",
    author: "The Johnsons",
    description: "Looking for a candid photographer for a small garden wedding in June.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    price: "$1500",
    status: 'approved'
  },
  {
    id: "9",
    type: "skill",
    title: "SEO Audit Specialist",
    author: "Kevin Patel",
    description: "Get a comprehensive report on why your website isn't ranking on Google.",
    image: "https://images.unsplash.com/photo-1571721795195-a2cb2d33e00d?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "10",
    type: "request",
    title: "Interior Design Consultation",
    author: "Modern Living",
    description: "Need help choosing furniture and colors for a 2-bedroom apartment.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    price: "$100/session",
    status: 'approved'
  },
  {
    id: "11",
    type: "skill",
    title: "Cyber Security Expert",
    author: "Alex Rivera",
    description: "Penetration testing and vulnerability assessment for small businesses.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    status: 'approved'
  },
  {
    id: "12",
    type: "request",
    title: "App Video Ad Creation",
    author: "AppDev Team",
    description: "Need a 30-second animated video for our new fitness app. Assets provided.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    price: "$500",
    status: 'approved'
  },
];

interface ContentCardProps {
  data: CardData;
  isDesktop: boolean;
  onPress?: () => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  hideTag?: boolean;
}

export default function ContentCard({ data, isDesktop, onPress, isOwner, onEdit, onDelete, hideTag }: ContentCardProps) {
  const { colors, isDark } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isDesktop && styles.desktopCard, 
        { 
          backgroundColor: colors.cardBackground, 
          borderColor: colors.border,
          boxShadow: isDark ? "0 4 20 rgba(0,0,0,0.3)" : "0 8 30 rgba(0,0,0,0.08)"
        }
      ]}
      onPress={onPress}
      activeOpacity={data.status === 'pending' ? 1 : 0.9}
      disabled={data.status === 'pending'}
    >
      {/* Cover Image Section */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: data.image }} 
          style={[styles.coverImage, data.status === 'pending' && { opacity: 0.6, grayscale: 1 } as any]} 
          resizeMode="cover"
        />
        {data.status === 'pending' && (
          <View style={[styles.pendingOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <View style={[styles.pendingBadge, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={styles.pendingBadgeText}>Pending Review</Text>
            </View>
          </View>
        )}
        {!hideTag && (
          <View style={[styles.badgeOverlay, { backgroundColor: data.type === 'skill' ? colors.primary : colors.text }]}>
            <Text style={[styles.badgeText, { color: colors.background }]}>
              {data.type === 'skill' ? 'SKILL AD' : 'SERVICE REQUEST'}
            </Text>
          </View>
        )}
        {data.price && (
          <View style={[styles.priceTag, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.priceText, { color: colors.text }]}>{data.price}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {data.title}
          </Text>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="heart-outline" size={20} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.authorRow}>
          <View style={[styles.miniAvatar, { backgroundColor: colors.iconBackground }]}>
            <Text style={[styles.miniAvatarText, { color: colors.primary }]}>
              {data.author.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.cardAuthor, { color: colors.secondaryText }]}>
            {data.author}
          </Text>
        </View>

        <Text style={[styles.cardDescription, { color: colors.mutedText }]} numberOfLines={2}>
          {data.description}
        </Text>
      </View>

      <View style={[styles.cardFooter, { borderTopColor: colors.border + '20' }]}>
        <View style={styles.footerActions}>
          {isOwner ? (
            <View style={styles.ownerActions}>
              <TouchableOpacity 
                style={[styles.miniDeleteBtn, { backgroundColor: colors.danger + '15' }]}
                onPress={onDelete}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editBtn, { backgroundColor: colors.primary }]}
                onPress={onEdit}
              >
                <Ionicons name="create-outline" size={18} color={colors.background} />
                <Text style={[styles.editBtnText, { color: colors.background }]}>Edit Ad</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              onPress={onPress}
            >
              <Text style={[styles.primaryActionBtnText, { color: colors.background }]}>
                View Details
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.background} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    width: "100%",
    marginBottom: 4, // Space for shadow
  },
  desktopCard: {
    width: "48%",
    minWidth: 340,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  pendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    boxShadow: "0 4 15 rgba(0,0,0,0.3)",
  },
  pendingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    boxShadow: "0 4 10 rgba(0,0,0,0.15)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    boxShadow: "0 4 10 rgba(0,0,0,0.1)",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
  },
  cardContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
    marginRight: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardAuthor: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  cardFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  footerActions: {
    flexDirection: "row",
    gap: 12,
  },
  ownerActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniDeleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    boxShadow: "0 4 12 rgba(0,0,0,0.1)",
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 16,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
