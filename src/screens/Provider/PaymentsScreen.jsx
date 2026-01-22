import React, { useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, Card, Divider, useTheme } from "react-native-paper";
import { COLORS } from "../../constants/Colors";

export default function PaymentScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 MOCK DATA (Replace with API later)
  const transactions = [
    {
      id: "1",
      title: "Website Design Project",
      date: "Aug 12, 2025",
      amount: 450,
      type: "credit",
      fee: 22.5,
    },
    {
      id: "2",
      title: "Mobile App Bug Fix",
      date: "Aug 08, 2025",
      amount: 120,
      type: "credit",
      fee: 6,
    },
    {
      id: "3",
      title: "Platform Withdrawal",
      date: "Aug 01, 2025",
      amount: 300,
      type: "debit",
      fee: 0,
    },
  ];

  const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Payments
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track your earnings, fees, and transaction history
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
        {/* SUMMARY CARD */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Fees Summary</Text>
            <Divider style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.label}>Total Fees Paid</Text>
              <Text style={styles.value}>${totalFees.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.label}>Platform Fee Rate</Text>
              <Text style={styles.value}>5%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* TRANSACTIONS */}
        <Text style={styles.sectionTitle}>Transaction History</Text>

        {transactions.map((tx) => (
          <Card key={tx.id} style={styles.transactionCard}>
            <Card.Content style={styles.transactionRow}>
              {/* LEFT STRIP (visual indicator instead of icon) */}
              <View
                style={[
                  styles.typeIndicator,
                  tx.type === "debit" && styles.debitIndicator,
                ]}
              />

              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text
                  style={[
                    styles.amount,
                    tx.type === "debit" && styles.debitAmount,
                  ]}
                >
                  {tx.type === "debit" ? "-" : "+"}${tx.amount.toFixed(2)}
                </Text>

                {tx.fee > 0 && (
                  <Text style={styles.feeText}>Fee: ${tx.fee.toFixed(2)}</Text>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}

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
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  /* SUMMARY CARD - ELEGANT VERSION */
  summaryCard: {
    borderRadius: 12,
    backgroundColor: COLORS.green,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0,
    // Add a slight "shadow" effect using a second border offset if you like,
    // but for now, we keep it clean.
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textDark,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#000000",
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  /* TRANSACTIONS SECTION */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  transactionCard: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, // Added breathing room
  },
  typeIndicator: {
    width: 6,
    height: 40,
    backgroundColor: COLORS.darkGreen, // Solid black for Credit
    borderRadius: 3,
    marginRight: 14,
  },
  debitIndicator: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.darkRed,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
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
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  debitAmount: {
    color: COLORS.textMuted, // Withdrawals are more subtle
  },
  feeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginTop: 2,
    fontStyle: "italic",
  },
});
