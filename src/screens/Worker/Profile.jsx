import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Avatar, Divider } from "react-native-paper";
import { COLORS } from "../../constants/Colors";

export default function ProfileScreen() {
  // 🔹 MOCK USER DATA (Replace with API)
  const user = {
    name: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "+92 300 1234567",
    city: "Lahore, Pakistan",
    rating: 4.8,
    totalReviews: 126,
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={78}
            label={user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.city}>{user.city}</Text>

          {/* RATING */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>{user.rating}</Text>
            <Text style={styles.ratingText}>
              ★ ({user.totalReviews} reviews)
            </Text>
          </View>
        </View>

        {/* INFO CARD */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>{user.city}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* PERFORMANCE CARD */}
        <Card style={styles.performanceCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Performance</Text>
            <Divider style={styles.divider} />

            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{user.rating}</Text>
                <Text style={styles.performanceLabel}>Rating</Text>
              </View>

              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{user.totalReviews}</Text>
                <Text style={styles.performanceLabel}>Reviews</Text>
              </View>

              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>98%</Text>
                <Text style={styles.performanceLabel}>Job Success</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  /* HEADER */
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: COLORS.surface, // Background white
    marginBottom: 12,
    borderWidth: 1, // Added border to avatar
    borderColor: "#000000",
  },
  avatarLabel: {
    fontWeight: "700",
    fontSize: 24,
    color: COLORS.textDark, // Dark text instead of white
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  city: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: COLORS.surface, // White background
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999, // Pill shape
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: COLORS.secondary,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textDark,
  },

  /* CARD STYLING (Matching JobCards) */
  infoCard: {
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#000000",

    elevation: 0, // Remove Android shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  performanceCard: {
    borderRadius: 12,
    backgroundColor: COLORS.green,
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0,
    shadowOpacity: 0,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
    textTransform: "uppercase", // Optional: gives it a clean UI look
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#000000", // Solid black divider
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
    marginTop: 2,
  },

  /* PERFORMANCE SECTION */
  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  performanceItem: {
    alignItems: "center",
    flex: 1,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark, // Removed blue
  },
  performanceLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 4,
  },
});
