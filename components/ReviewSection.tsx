import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
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
    comment: "Absolutely fantastic service. Exceeded all my expectations and delivered on time!",
    date: "2 days ago",
  },
  {
    id: "2",
    author: "Chris M.",
    rating: 4,
    comment: "Very professional and great communication. Would definitely work with them again.",
    date: "1 week ago",
  },
];

export default function ReviewSection({ 
  providerName, 
  hasCompletedService = false 
}: { 
  providerName: string;
  hasCompletedService?: boolean;
}) {
  const { colors } = useTheme();

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isWriting, setIsWriting] = useState(false);
  
  // Form State
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  const userReview = reviews.find(r => r.author === "You");

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
      // Simulate API call
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
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>Reviews</Text>
          <View style={[styles.badge, { backgroundColor: colors.iconBackground }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{reviews.length}</Text>
          </View>
        </View>
        
        <View style={styles.ratingSummary}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={[styles.averageRating, { color: colors.text }]}>{averageRating}</Text>
        </View>
      </View>

      {/* Write a Review Toggle */}
      {!isWriting && (hasCompletedService || userReview) && (
        <View style={styles.promptContainer}>
          {hasCompletedService && !userReview && (
             <Text style={[styles.pendingReviewText, { color: colors.primary }]}>
                ✨  You&apos;ve recently had a service rendered! Feel free to share your experience by leaving a review.!
             </Text>
          )}
          <TouchableOpacity 
            style={[styles.writeToggle, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            onPress={toggleWrite}
            activeOpacity={0.7}
          >
            <Ionicons name={userReview ? "pencil" : "create-outline"} size={22} color={colors.primary} />
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
          
          <View style={styles.starsRow}>
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
                  size={36} 
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
            placeholder="Share details of your experience..."
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
                  <Text style={[styles.loadingBtnText, { color: colors.background }]}>Submitting...</Text>
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
        {reviews.map((rev) => (
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
                  <Text style={[styles.revAuthor, { color: colors.text }]}>{rev.author}</Text>
                  <Text style={[styles.revDate, { color: colors.mutedText }]}>{rev.date}</Text>
                </View>
              </View>
              <View style={styles.revStars}>
                {[1, 2, 3, 4, 5].map(star => (
                   <Ionicons 
                    key={star} 
                    name="star" 
                    size={14} 
                    color={star <= rev.rating ? "#FFD700" : colors.border} 
                   />
                ))}
              </View>
            </View>
            <Text style={[styles.revComment, { color: colors.secondaryText }]}>
              {rev.comment}
            </Text>
          </Animated.View>
        ))}
        {reviews.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>No reviews yet.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: "800",
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
    marginBottom: 25,
  },
  promptContainer: {
    marginBottom: 5,
  },
  pendingReviewText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  writeToggleText: {
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 25,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ff3b3015",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    fontSize: 15,
    height: 100,
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
    fontWeight: "600",
  },
  submitBtnWrapper: {
    minWidth: 120,
  },
  submitBtn: {
    marginVertical: 0,
  },
  loadingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  loadingBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  list: {
    gap: 15,
  },
  reviewCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: "0px 4px 15px rgba(0,0,0,0.03)",
    elevation: 2,
  },
  revHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  revAuthorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: "700",
  },
  revAuthor: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  revDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  revStars: {
    flexDirection: "row",
    gap: 2,
  },
  revComment: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
