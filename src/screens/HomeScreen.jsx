import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, Avatar } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors.js";

const { width } = Dimensions.get("window");

const REVIEWS = [
  {
    id: "1",
    name: "Zain R.",
    rating: 5,
    text: "Got my payment instantly after approval!",
    avatar: "ZR",
    color: COLORS.purple,
  },
  {
    id: "2",
    name: "Elena G.",
    rating: 5,
    text: "The escrow system gave me peace of mind.",
    avatar: "EG",
    color: COLORS.pink,
  },
  {
    id: "3",
    name: "Sana K.",
    rating: 4,
    text: "Top-tier workers available here.",
    avatar: "SK",
    color: COLORS.orange,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. HERO SECTION */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>SECURE ESCROW</Text>
        </View>
        <Text style={styles.heroTitle}>HIRE FAST.{"\n"}EARN EASY.</Text>
        <Text style={styles.heroSubtitle}>
          The safest marketplace for micro-tasks. Your money stays in escrow
          until the job is done.
        </Text>
        <TouchableOpacity style={styles.mainActionButton}>
          <Text style={styles.mainActionText}>Get Started</Text>
          <Icon name="chevron-right" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 2. STATS ROW */}
        <View style={styles.statsContainer}>
          <View
            style={[styles.statItem, { backgroundColor: COLORS.secondary }]}
          >
            <Text style={styles.statValue}>1.2k+</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: COLORS.blue }]}>
            <Text style={styles.statValue}>$15k</Text>
            <Text style={styles.statLabel}>Protected</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: COLORS.purple }]}>
            <Text style={styles.statValue}>4.9/5</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* 3. WHY CHOOSE US */}
        <Text style={styles.sectionLabel}>Trust & Security</Text>
        <View style={styles.featureRow}>
          <View
            style={[
              styles.featureCard,
              { flex: 1, backgroundColor: COLORS.textDark },
            ]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: COLORS.secondary }]}
            >
              <Icon name="shield-lock" size={28} color={COLORS.textDark} />
            </View>
            <Text style={[styles.featureTitle, { color: COLORS.surface }]}>
              Escrow Pay
            </Text>
            <Text
              style={[styles.featureDesc, { color: COLORS.accentHighlight }]}
            >
              Funds held safely until job approval.
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { flex: 1, backgroundColor: COLORS.textDark },
            ]}
          >
            <View
              style={[styles.iconBox, { backgroundColor: COLORS.secondary }]}
            >
              <Icon name="flash" size={28} color={COLORS.textDark} />
            </View>
            <Text style={[styles.featureTitle, { color: COLORS.surface }]}>
              Lightning
            </Text>
            <Text
              style={[styles.featureDesc, { color: COLORS.accentHighlight }]}
            >
              Withdrawals processed in minutes.
            </Text>
          </View>
        </View>

        {/* 4. USER REVIEWS SECTION */}
        <Text style={styles.sectionLabel}>Community Feedback</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reviewsScroll}
        >
          {REVIEWS.map((item) => (
            <View key={item.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Avatar.Text
                  size={32}
                  label={item.avatar}
                  style={{
                    backgroundColor: item.color,
                    borderWidth: 1,
                    borderColor: "#000",
                  }}
                  labelStyle={{ fontSize: 12, color: COLORS.textDark }}
                />
                <Text style={styles.reviewName}>{item.name}</Text>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color={COLORS.burntOrange} />
                  <Text style={styles.ratingText}>{item.rating}.0</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>"{item.text}"</Text>
            </View>
          ))}
        </ScrollView>

        {/* 5. RECENT ACTIVITY */}
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Trending Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobPreview}>
            <View style={[styles.jobIcon, { backgroundColor: COLORS.green }]}>
              <Icon name="video-outline" size={24} color={COLORS.textDark} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.jobTitle}>Short Video Editing</Text>
              <Text style={styles.jobMeta}>Remote • $35.00</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textDark} />
          </View>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundLight },
  content: { paddingHorizontal: 20 },

  // HERO SECTION
  heroCard: {
    backgroundColor: COLORS.primary,
    margin: 20,
    marginTop: 40,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
  },
  heroBadge: {
    backgroundColor: COLORS.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  heroBadgeText: { color: COLORS.textDark, fontSize: 10, fontWeight: "800" },
  heroTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.surface,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.blue,
    marginTop: 12,
    fontWeight: "600",
    lineHeight: 20,
  },
  mainActionButton: {
    backgroundColor: COLORS.secondary,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainActionText: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },

  // STATS ROW
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000",
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "900", color: COLORS.textDark },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },

  // FEATURES
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 10,
    color: COLORS.textMuted,
  },
  featureRow: { flexDirection: "row", gap: 10, marginBottom: 25 },
  featureCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  featureDesc: { fontSize: 11, fontWeight: "600", lineHeight: 16 },

  // REVIEWS
  reviewsScroll: { marginBottom: 25 },
  reviewCard: {
    width: 260,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#000",
    marginRight: 12,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  reviewName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "800",
    fontSize: 14,
    color: COLORS.textDark,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 3,
    color: COLORS.textDark,
  },
  reviewText: {
    fontSize: 13,
    fontStyle: "italic",
    color: COLORS.textDark,
    fontWeight: "500",
  },

  // ACTIVITY BOX
  activityBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: COLORS.surface,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  activityTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
  viewAll: { fontSize: 13, fontWeight: "700", color: COLORS.burntOrange },
  jobPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  jobIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  jobTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textDark },
  jobMeta: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600" },
});
