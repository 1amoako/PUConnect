import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { GlassButton } from "./GlassButton";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Alex D.",
    rating: 5,
    comment: "Absolutely fantastic service. Exceeded all my expectations and delivered on time! The attention to detail was remarkable, and they guided me through every step of the process with extreme professionalism.",
    date: "2 days ago",
  },
  {
    id: "2",
    author: "Chris M.",
    rating: 4,
    comment: "Very professional and great communication. Would definitely work with them again. The only minor thing was a slight delay in the initial response, but once we started, it was smooth sailing.",
    date: "1 week ago",
  },
  {
    id: "3",
    author: "Sarah J.",
    rating: 5,
    comment: "Incredible attention to detail. Highly recommended for complex projects. They took my vague requirements and turned them into something truly polished.",
    date: "2 weeks ago",
  },
  {
    id: "4",
    author: "Mike T.",
    rating: 4,
    comment: "Good work overall. They really understood the brief and delivered exactly what I was looking for.",
    date: "1 month ago",
  },
  {
    id: "5",
    author: "Emma L.",
    rating: 2,
    comment: "The communication was a bit lacking for my taste, though the final output was okay. I expected more proactive updates.",
    date: "2 months ago",
  },
];

export default function ReviewSection({ 
  providerName, 
  hasCompletedService = false,
  limit,
  onViewAll,
  hideTitle = false
}: { 
  providerName: string;
  hasCompletedService?: boolean;
  limit?: number;
  onViewAll?: () => void;
  hideTitle?: boolean;
}) {
  const { colors, isDark } = useTheme();

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isWriting, setIsWriting] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  
  // Form State
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const userReview = reviews.find(r => r.author === "You");

  // Calculate star distribution
  const starCounts = [0, 0, 0, 0, 0, 0]; // Index 1-5
  reviews.forEach(r => { starCounts[r.rating]++; });
  const maxCount = Math.max(...starCounts, 1);

  const filteredReviews = reviews.filter(r => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Top Rated") return r.rating >= 4;
    if (activeFilter === "Critical") return r.rating <= 2;
    return true;
  });

  const displayReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;

  const toggleExpand = (id: string) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHelpful = (id: string) => {
    setHelpfulReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWrite = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWriting(!isWriting);
    if (!isWriting && userReview) {
      setDraftRating(userReview.rating);
      setDraftComment(userReview.comment);
      setError(null);
    } else if (!isWriting) {
      setDraftRating(0);
      setDraftComment("");
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (draftRating === 0) {
      setError("Please select a rating to submit your review.");
      return;
    }
    if (draftComment.trim().length < 5) {
      setError("Please write a bit more in your comment (min 5 chars).");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newReview: Review = {
        id: userReview ? userReview.id : Date.now().toString(),
        author: "You",
        rating: draftRating,
        comment: draftComment.trim(),
        date: userReview ? "Edited just now" : "Just now",
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (userReview) {
        setReviews(reviews.map(r => r.id === userReview.id ? newReview : r));
      } else {
        setReviews([newReview, ...reviews]);
      }
      setIsWriting(false);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!hideTitle && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Reviews</Text>
            <View style={[styles.badge, { backgroundColor: colors.iconBackground }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>{reviews.length}</Text>
            </View>
          </View>
          <View style={styles.ratingSummarySmall}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.averageRatingSmall, { color: colors.text }]}>{averageRating}</Text>
          </View>
        </View>
      )}

      {/* Premium Rating Summary Card */}
      {!limit && (
        <View style={[styles.summaryCard, { backgroundColor: isDark ? colors.cardBackground : '#f9f9f9', borderColor: colors.border }]}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.bigRating, { color: colors.text }]}>{averageRating}</Text>
            <View style={styles.starsRowSmall}>
              {[1, 2, 3, 4, 5].map(s => (
                <Ionicons key={s} name="star" size={14} color={s <= Math.round(Number(averageRating)) ? "#FFD700" : colors.border} />
              ))}
            </View>
            <Text style={[styles.totalReviews, { color: colors.mutedText }]}>{reviews.length} reviews</Text>
          </View>
          <View style={styles.summaryRight}>
            {[5, 4, 3, 2, 1].map(star => (
              <View key={star} style={styles.barRow}>
                <Text style={[styles.barLabel, { color: colors.mutedText }]}>{star}</Text>
                <View style={[styles.barContainer, { backgroundColor: colors.iconBackground }]}>
                  <View 
                    style={[
                      styles.barFill, 
                      { 
                        backgroundColor: colors.primary, 
                        width: `${(starCounts[star] / maxCount) * 100}%` 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Filter Pills */}
      {!limit && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {["All", "Latest", "Top Rated", "Critical"].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                { backgroundColor: colors.background, borderColor: colors.border },
                activeFilter === filter && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                { color: colors.secondaryText },
                activeFilter === filter && { color: colors.background }
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Write a Review Toggle */}
      {!isWriting && (hasCompletedService || userReview) && (
        <View style={styles.promptContainer}>
          {hasCompletedService && !userReview && (
             <Text style={[styles.pendingReviewText, { color: colors.primary }]}>
                ✨  Share your experience with {providerName}!
             </Text>
          )}
          <TouchableOpacity 
            style={[styles.writeToggle, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={toggleWrite}
            activeOpacity={0.7}
          >
            <Ionicons name={userReview ? "pencil" : "create-outline"} size={20} color={colors.primary} />
            <Text style={[styles.writeToggleText, { color: colors.text }]}>
              {userReview ? "Edit your review" : "Write a review"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Inline Form */}
      {isWriting && (
        <Animated.View 
          entering={FadeInDown} 
          layout={Layout.springify()} 
          style={[styles.formContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        >
          <Text style={[styles.formTitle, { color: colors.text }]}>
            {userReview ? "Edit your review" : `Rate ${providerName}`}
          </Text>
          
          <View style={styles.starsRowLarge}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => {
                  setDraftRating(star);
                  if (error) setError(null);
                }}
                disabled={loading}
              >
                <Ionicons 
                  name={star <= draftRating ? "star" : "star-outline"} 
                  size={32} 
                  color={star <= draftRating ? "#FFD700" : colors.mutedText} 
                />
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#ff3b30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={[
              styles.input, 
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }
            ]}
            placeholder="What did you like or dislike about the service?"
            placeholderTextColor={colors.mutedText}
            multiline
            numberOfLines={4}
            value={draftComment}
            onChangeText={(txt) => {
              setDraftComment(txt);
              if (error) setError(null);
            }}
            editable={!loading}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={toggleWrite} style={styles.cancelBtn} disabled={loading}>
              <Text style={[styles.cancelBtnText, { color: colors.mutedText }]}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.submitBtnWrapper}>
              {loading ? (
                <View style={[styles.loadingBtn, { backgroundColor: colors.primary }]}>
                  <ActivityIndicator color={colors.background} size="small" />
                </View>
              ) : (
                <GlassButton 
                  title="Submit" 
                  onPress={handleSubmit} 
                  style={styles.submitBtn} 
                />
              )}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Reviews List */}
      <View style={styles.list}>
        {displayReviews.map((rev) => {
          const isExpanded = expandedReviews[rev.id];
          const isHelpful = helpfulReviews[rev.id];
          const shouldShowMore = rev.comment.length > 150;
          const displayText = (!isExpanded && shouldShowMore) 
            ? rev.comment.substring(0, 147) + "..." 
            : rev.comment;

          return (
            <Animated.View 
              key={rev.id} 
              entering={FadeInDown} 
              layout={Layout.springify()} 
              style={[styles.reviewCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            >
              <View style={styles.revHeader}>
                <View style={styles.revAuthorInfo}>
                  <View style={[styles.avatarPlaceholder, { backgroundColor: colors.iconBackground }]}>
                    <Text style={[styles.avatarInitial, { color: colors.primary }]}>
                      {rev.author.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <View style={styles.authorRow}>
                      <Text style={[styles.revAuthor, { color: colors.text }]}>{rev.author}</Text>
                      <View style={[styles.verifiedBadge, { backgroundColor: colors.primary + '15' }]}>
                        <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                        <Text style={[styles.verifiedText, { color: colors.primary }]}>Verified</Text>
                      </View>
                    </View>
                    <Text style={[styles.revDate, { color: colors.mutedText }]}>{rev.date}</Text>
                  </View>
                </View>
                <View style={styles.revStars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons 
                      key={star} 
                      name="star" 
                      size={12} 
                      color={star <= rev.rating ? "#FFD700" : colors.border} 
                    />
                  ))}
                </View>
              </View>
              
              <Text style={[styles.revComment, { color: colors.secondaryText }]}>
                {displayText}
              </Text>
              
              {shouldShowMore && (
                <TouchableOpacity onPress={() => toggleExpand(rev.id)} style={styles.moreBtn}>
                  <Text style={[styles.moreBtnText, { color: colors.primary }]}>
                    {isExpanded ? "Show less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.revFooter}>
                <TouchableOpacity 
                   style={[styles.helpfulBtn, isHelpful && { backgroundColor: colors.primary + '10' }]} 
                   onPress={() => toggleHelpful(rev.id)}
                >
                  <Ionicons 
                    name={isHelpful ? "thumbs-up" : "thumbs-up-outline"} 
                    size={14} 
                    color={isHelpful ? colors.primary : colors.mutedText} 
                  />
                  <Text style={[styles.helpfulText, { color: isHelpful ? colors.primary : colors.mutedText }]}>
                    Helpful
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        })}
        
        {displayReviews.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No reviews match this filter.</Text>
          </View>
        )}
        
        {limit !== undefined && reviews.length > limit && (
          <TouchableOpacity 
            style={[styles.viewAllBtn, { borderColor: colors.border }]}
            onPress={onViewAll}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewAllText, { color: colors.text }]}>
              Show all {reviews.length} reviews
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.text} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  barContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  ratingSummarySmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  averageRatingSmall: {
    fontSize: 16,
    fontWeight: "800",
  },
  summaryCard: {
    flexDirection: "row",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 25,
    alignItems: "center",
  },
  summaryLeft: {
    alignItems: "center",
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.05)",
    minWidth: 110,
  },
  bigRating: {
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 48,
    marginBottom: 8,
  },
  starsRowSmall: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 6,
  },
  totalReviews: {
    fontSize: 12,
    fontWeight: "600",
  },
  summaryRight: {
    flex: 1,
    paddingLeft: 24,
    gap: 5,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: "700",
    width: 10,
  },
  filterScroll: {
    marginBottom: 25,
    marginHorizontal: -5,
  },
  filterContent: {
    paddingHorizontal: 5,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  promptContainer: {
    marginBottom: 20,
  },
  pendingReviewText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  writeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  writeToggleText: {
    fontSize: 15,
    fontWeight: "700",
  },
  formContainer: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 30,
    boxShadow: "0 4 10 rgba(0, 0, 0, 0.05)",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  starsRowLarge: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 25,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ff3b3015",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 15,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  submitBtnWrapper: {
    minWidth: 100,
  },
  submitBtn: {
    marginVertical: 0,
  },
  loadingBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    gap: 16,
  },
  reviewCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  revHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  revAuthorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "800",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  revAuthor: {
    fontSize: 16,
    fontWeight: "800",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  revDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  revStars: {
    flexDirection: "row",
    gap: 2,
  },
  revComment: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
  moreBtn: {
    marginTop: 8,
  },
  moreBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  revFooter: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
  },
  helpfulBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  helpfulText: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
  },
  viewAllBtn: {
    flexDirection: "row",
    padding: 18,
    borderWidth: 1.5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
