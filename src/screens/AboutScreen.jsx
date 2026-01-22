import React from "react";
import { View, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

export default function AboutScreen() {
  const values = [
    {
      title: "Radical Trust",
      desc: "Our escrow system ensures neither party is at risk. Security isn't a feature; it's our foundation.",
      icon: "shield-lock",
    },
    {
      title: "Fair Scale",
      desc: "We provide local talent with the tools to compete globally, starting with their own community.",
      icon: "scale-balance",
    },
    {
      title: "Instant Velocity",
      desc: "Payments move at the speed of light. Completion to cash-out happens in real-time.",
      icon: "trending-up",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 1. HEADER SECTION */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageHeader}>WE ARE{"\n"}THE BRIDGE.</Text>
            <View style={styles.underline} />
          </View>
          <View style={styles.orangeCircle}>
            <Icon name="vlc" size={40} color="#000" />
          </View>
        </View>

        {/* 2. MISSION BOX (Inverted) */}
        <View style={styles.missionCard}>
          <Text style={styles.sectionLabelLight}>The Mission</Text>
          <Text style={styles.missionText}>
            To democratize local labor by providing a high-trust, low-friction
            environment where skills are rewarded instantly and providers work
            with total peace of mind.
          </Text>
        </View>

        {/* 3. CORE VALUES */}
        <Text style={styles.sectionLabel}>Core Values</Text>
        {values.map((item, index) => (
          <View key={index} style={styles.valueCard}>
            <View style={styles.valueIconBox}>
              <Icon name={item.icon} size={24} color="#000" />
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueTitle}>{item.title}</Text>
              <Text style={styles.valueDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* 4. LEADERSHIP SECTION */}
        <Text style={styles.sectionLabel}>Leadership</Text>
        <View style={styles.leadershipRow}>
          <View style={styles.leaderCard}>
            <View style={styles.avatarPlaceholder}>
              <Icon name="account-tie" size={40} color="#000" />
            </View>
            <Text style={styles.leaderName}>Sarah J.</Text>
            <Text style={styles.leaderRole}>CEO & Vision</Text>
          </View>

          <View style={[styles.leaderCard, { backgroundColor: "#F3F4F6" }]}>
            <View style={styles.avatarPlaceholder}>
              <Icon name="code-braces" size={40} color="#000" />
            </View>
            <Text style={styles.leaderName}>Ahmed K.</Text>
            <Text style={styles.leaderRole}>CTO & Engineering</Text>
          </View>
        </View>

        {/* 5. FOOTER DECAL */}
        <View style={styles.footerDecal}>
          <Text style={styles.footerText}>EST. 2025 • BUILT FOR WORKERS</Text>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 20 },

  // HEADER
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 30,
  },
  headerTextContainer: { flex: 1 },
  pageHeader: {
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    lineHeight: 42,
  },
  underline: {
    height: 6,
    width: 80,
    backgroundColor: COLORS.burntOrange, // Burnt Orange
    marginTop: 8,
    borderRadius: 3,
  },
  orangeCircle: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.burntOrange,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    // Hard shadow
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  // MISSION CARD
  missionCard: {
    backgroundColor: "#1F2937", // Deep Slate
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 30,
  },
  sectionLabelLight: {
    color: COLORS.burntOrange,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  missionText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },

  // VALUES
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    color: "#000",
  },
  valueCard: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  valueIconBox: {
    width: 44,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  valueTextContainer: { flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: "800", color: "#000" },
  valueDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 4,
  },

  // LEADERSHIP
  leadershipRow: { flexDirection: "row", gap: 15 },
  leaderCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.burntOrange,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  leaderName: { fontSize: 16, fontWeight: "800" },
  leaderRole: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },

  // FOOTER DECAL
  footerDecal: {
    marginTop: 40,
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1.5,
    borderTopColor: "#000",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    borderStyle: "dashed",
  },
  footerText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 2,
  },
});
