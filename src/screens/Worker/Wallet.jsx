import React, { useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, Card, Divider, useTheme } from "react-native-paper";
import { COLORS } from "./../../constants/Colors";

export default function EarningsScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 MOCK DATA (Replace with API)
  const summary = {
    totalEarnings: 1850,
    pendingEarnings: 320,
    jobsCompleted: 14,
  };

  const transactions = [
    {
      id: "1",
      title: "Landing Page Development",
      date: "Aug 14, 2025",
      amount: 450,
      status: "completed",
    },
    {
      id: "2",
      title: "API Integration Task",
      date: "Aug 09, 2025",
      amount: 300,
      status: "pending",
    },
    {
      id: "3",
      title: "Bug Fixes",
      date: "Aug 03, 2025",
      amount: 200,
      status: "completed",
    },
    {
      id: "4",
      title: "Bug Fixes",
      date: "Aug 03, 2025",
      amount: 200,
      status: "completed",
    },
    {
      id: "5",
      title: "Bug Fixes",
      date: "Aug 03, 2025",
      amount: 200,
      status: "completed",
    },
    {
      id: "6",
      title: "Bug Fixes",
      date: "Aug 03, 2025",
      amount: 200,
      status: "completed",
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Earnings
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Overview of your income and completed work
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* SUMMARY CARDS (3 IN A ROW) */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
              <Text style={styles.summaryValue}>${summary.totalEarnings}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>
                ${summary.pendingEarnings}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Text style={styles.summaryLabel}>Jobs Done</Text>
              <Text style={styles.summaryValue}>{summary.jobsCompleted}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* TRANSACTIONS (WIDE SECTION) */}
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <Divider style={styles.divider} />

            {transactions.map((tx) => (
              <View key={tx.id} style={styles.transactionRow}>
                <View
                  style={[
                    styles.statusIndicator,
                    tx.status === "pending" && styles.pendingIndicator,
                  ]}
                />

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionDate}>{tx.date}</Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text style={styles.amount}>${tx.amount.toFixed(2)}</Text>
                  <Text
                    style={[
                      styles.statusText,
                      tx.status === "pending" && styles.pendingText,
                    ]}
                  >
                    {tx.status === "pending" ? "Pending" : "Completed"}
                  </Text>
                </View>
              </View>
            ))}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#000000", // Solid black border
  },
  title: {
    fontSize: 20,
    fontWeight: "800", // Heavier weight
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  /* SUMMARY SECTION */
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    // Ensure the row itself has no hidden constraints
    width: "100%",
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0,
    // Added: ensures the Card component itself tries to center children
    justifyContent: "center",
  },

  // ADD THIS: react-native-paper Card.Content needs explicit centering
  summaryCardContent: {
    alignItems: "center", // Horizontal centering
    justifyContent: "center", // Vertical centering
    paddingHorizontal: 0, // Remove extra horizontal padding to save space
    paddingVertical: 12, // Give it some breathing room top/bottom
  },

  summaryLabel: {
    fontSize: 10, // Slightly smaller to ensure it fits on one line
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center", // Center text alignment
  },
  summaryValue: {
    fontSize: 16, // Scaled slightly for 3-column fit
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 4,
    textAlign: "center", // Center text alignment
  },
  /* TRANSACTIONS SECTION */
  transactionsCard: {
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#000000", // Solid black divider
    marginBottom: 16,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  statusIndicator: {
    width: 6,
    height: "100%",
    backgroundColor: COLORS.darkGreen, // Default black indicator
    borderRadius: 2,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#000000",
  },
  pendingIndicator: {
    backgroundColor: COLORS.secondary, // Yellow for pending (optional, or keep black)
    borderWidth: 1,
    borderColor: "#000000",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    marginTop: 2,
    textTransform: "uppercase",
  },
  pendingText: {
    color: COLORS.textMuted,
  },
});
