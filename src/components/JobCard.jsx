// src/components/JobCard.js (Updated Status Logic and Conditional Rendering)
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { COLORS } from "../constants/Colors";

// Helper function to define the background and text color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "posted": // Primary action needed (Worker: Accept)
      return { background: COLORS.blue, text: COLORS.primary };
    case "submitted": // Pending Approval (Worker: Waiting, Provider: Action Needed)
      return { background: COLORS.yellow, text: "#78350F" }; // Yellow/Amber
    case "accepted": // Job is Live/In Progress
      return { background: COLORS.green, text: "#065F46" }; // Mint Green
    case "completed": // Work done, waiting for payout/final review
    case "approved":
      return { background: "#34D399", text: "#047857" }; // Strong Green
    case "disputed":
      return { background: "#FCA5A5", text: "#B91C1C" }; // Red
    case "cancelled":
      return { background: "#E5E7EB", text: "#4B5563" }; // Gray
    default:
      return { background: "#E5E7EB", text: "#4B5563" };
  }
};

/**
 * Universal Job Card Component for both Worker (Job Seeker) and Provider (Job Poster)
 */
export default function JobCard({
  title,
  worker,
  date,
  location,
  budget,
  status,
  onPress,
  type = "worker",
  client,
}) {
  const statusStyle = getStatusColor(status);

  const getActionText = () => {
    if (type === "provider") {
      if (status === "submitted") return "Approve Assignment";
      return status === "posted" ? "View Applicants" : "Manage Job & Escrow";
    }
    // Worker View (Job Seeker)
    if (status === "submitted") {
      return "Waiting for Approval";
    }
    return status === "accepted" ? "View Details" : "Accept Job";
  };

  const getActionIcon = () => {
    if (type === "provider") {
      if (status === "submitted") return "check-decagram-outline";
      return status === "posted" ? "account-multiple-outline" : "cash-multiple";
    }
    // Worker View (Job Seeker)
    if (status === "submitted") {
      return "timer-sand";
    }
    return status === "accepted" ? "progress-check" : "check-circle-outline";
  };

  // Disable button logic:
  const isDisabled = type === "worker" && status === "submitted";
  // Also disable the button if the job is already past the acceptance stage for a worker
  const shouldHideButton =
    type === "worker" &&
    status !== "posted" &&
    status !== "accepted" &&
    status !== "submitted";

  // Helper function to display the date string cleanly
  const getFormattedDate = () => {
    const cleanedDate = date.replace(/\*\*/g, "");
    const prefix = cleanedDate.includes("Due:") ? "Due:" : "Posted:";
    const dateString = cleanedDate
      .replace("Due:", "")
      .replace("Posted:", "")
      .trim();
    return `${prefix} ${dateString}`;
  };

  return (
    <View style={[styles.cardWrapper]}>
      {/* 1. Header: Title */}
      <View style={styles.header}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={[styles.payoutBadgeContainer]}>
        <Text style={styles.payoutBadgeText}>{budget}</Text>
      </View>

      <View style={styles.separator} />

      {/* 2. Key Details (Location & Date/Status) */}
      <View style={styles.detailRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={16}
          color={COLORS.textMuted}
        />
        <Text style={styles.detailText}>{location}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={16}
          color={COLORS.textMuted}
        />
        <Text style={styles.detailText}>{getFormattedDate()}</Text>
      </View>

      {/* 3. Role-Specific Details */}
      <View style={styles.roleDetailsContainer}>
        {/* Detail: Assigned Worker (Provider View) or Client (Worker View) */}
        {type === "provider" && worker && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="account-check"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.detailDetailText}>
              Worker:
              <Text style={{ fontWeight: "700", color: COLORS.textDark }}>
                {worker}
              </Text>
            </Text>
          </View>
        )}
        {type === "worker" && client && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.detailDetailText}>
              Client:
              <Text style={{ fontWeight: "700", color: COLORS.textDark }}>
                {client}
              </Text>
            </Text>
          </View>
        )}
        {/* Status Badge moved here to ensure visibility */}
        <View
          style={[
            styles.miniStatusBadge,
            { backgroundColor: statusStyle.background },
          ]}
        >
          <Text style={[styles.miniStatusText, { color: statusStyle.text }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* 4. Action Button (Uses CustomButton) */}
      {!shouldHideButton && (
        <CustomButton
          type="primary"
          title={getActionText()}
          onPress={onPress}
          icon={getActionIcon()}
          disabled={isDisabled} // Disable for worker in 'submitted' state
          style={[styles.actionButton]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000000",
    borderLeftColor: "#000000",
    // shadowColor: COLORS.textDark,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    flexShrink: 1,
  },
  payoutBadgeContainer: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: "flex-start", // Important: controls its width
    marginBottom: 10,
  },
  payoutBadgeText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.accentHighlight,
    marginVertical: 8,
  },
  // Key Details Rows
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  roleDetailsContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailDetailText: {
    marginLeft: 8,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  // Status badge style (for secondary position)
  miniStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 15,
    alignSelf: "flex-end",
  },
  miniStatusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  // Action Button (uses CustomButton styling)
  actionButton: {
    marginTop: 15,
    backgroundColor: COLORS.primary,
    color: "#fff",
    width: "100%",
  },
});
