// src/screens/Worker/MyApplicationScreen.js (Updated)
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { becomeProvider } from "../../helpers/becomeProvider";
import { fetchWorkerJobs } from "../../helpers/fetchWorkerJobs"; // NEW IMPORT
import JobCard from "../../components/JobCard"; // Assuming JobCard is available
import { COLORS } from "../../constants/Colors"; // Assuming COLORS is defined

export default function MyApplicationScreen() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // --- Data Fetching Logic ---
  const loadJobs = async () => {
    setIsRefreshing(true);
    try {
      const fetchedJobs = await fetchWorkerJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      // Note: If user is logged out (e.g., in transit), the helper throws an error.

      Toast.show({
        type: "error",
        text1: "Data Error",
        text2: error.message || "Failed to load your accepted jobs.",
      });
      setJobs([]);
    } finally {
      setListLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);
  // ----------------------------

  const handleBecomeProvider = async () => {
    setIsSwitching(true);
    await becomeProvider();
    setIsSwitching(false);
  };

  const handleViewDetails = (jobId) => {
    // Implement navigation to Job Details screen here:
    console.log("View Accepted Job Details:", jobId);
  };

  // --- Render Content ---
  const renderContent = () => {
    if (listLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (jobs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            No Accepted Jobs Yet.
          </Text>
          <Text variant="bodyMedium" style={styles.emptyTextMuted}>
            Browse available jobs in the 'Jobs Available' tab!
          </Text>
        </View>
      );
    }

    return (
      <>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            type="worker" // CRUCIAL: Enables client logic in JobCard
            title={job.title}
            client={job.client} // Passed from helper
            // Use the job's deadline_at for the date display
            date={`Due: ${new Date(job.deadline_at).toLocaleDateString()}`}
            location={job.location}
            budget={`$${job.budget.toFixed(2)}`} // Ensure budget is formatted
            status={job.status}
            onPress={() => handleViewDetails(job.id)}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.titleText}>
          My Accepted Work ({jobs.length})
        </Text>
        <Text variant="bodyMedium" style={styles.subtitleText}>
          Track your progress, communicate with clients, and manage payouts.
        </Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadJobs}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderContent()}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: COLORS.backgroundLight },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentHighlight,
  },
  titleText: { fontSize: 20, fontWeight: "700", color: COLORS.textDark },
  subtitleText: { fontSize: 14, color: COLORS.textMuted },
  scrollView: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },

  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: { color: COLORS.textDark, fontWeight: "700", marginBottom: 5 },
  emptyTextMuted: { color: COLORS.textMuted, textAlign: "center" },

  switchContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.accentHighlight,
    width: "100%",
    alignItems: "center",
  },
  switchPromptText: {
    marginBottom: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    fontWeight: "600",
  },
  switchButton: {
    width: "80%",
    paddingVertical: 5,
    borderRadius: 50,
  },
});
