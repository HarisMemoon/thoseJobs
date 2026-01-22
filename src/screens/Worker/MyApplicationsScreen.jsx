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
import JobDetailsModal from "../../components/JobDetailsModal";

export default function MyApplicationScreen() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

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
  // UPDATED: Function to open modal with the correct job data
  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setDetailsModalVisible(true);
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
            onPress={() => handleOpenDetails(job)}
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
        <JobDetailsModal
          visible={detailsModalVisible}
          job={selectedJob}
          type="worker"
          onClose={() => {
            setDetailsModalVisible(false);
            setSelectedJob(null);
          }}
          // Logic for "Go to Chat" or "Update Status" can be handled here
          onPrimaryAction={(id) => console.log("Action for Job:", id)}
        />
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // Header Section
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    // THE THEME UPDATE: Solid black bottom border
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800", // Heavier for the high-contrast look
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },

  scrollView: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },

  // Empty State (Matching JobCard style)
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000000", // Add border to match cards
    elevation: 0,
  },
  emptyText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  emptyTextMuted: {
    color: COLORS.textMuted,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 18,
  },

  // Switch Role Section
  switchContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    borderStyle: "dashed", // Visual indicator for "Switching/Action"
    width: "100%",
    alignItems: "center",
  },
  switchPromptText: {
    marginBottom: 15,
    color: COLORS.textDark,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },
  switchButton: {
    width: "100%", // Full width inside the container looks more "Flat UI"
    // borderRadius will be handled by the CustomButton component
    // but ensure it's pill-shaped (999) there
  },
});
