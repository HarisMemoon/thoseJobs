// src/screens/Worker/JobsScreen.js (FINAL CORRECTED VERSION)
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { fetchAvailableJobs } from "../helpers/fetchAvailableJobs";
import JobCard from "../components/JobCard";
import { acceptJobRequest } from "../helpers/acceptJobRequest";
import { COLORS } from "../constants/Colors";
import JobSearchAndFilter from "../components/JobSearchAndFilter";
import SubmitQuoteModal from "../components/SubmitQouteModal";
import JobDetailsModal from "../components/JobDetailsModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "react-native-toast-message";

export default function JobsScreen() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialFilters = {
    search: "",
    sort: "created_at_desc",
    location: null,
    category: null,
  };
  const [filters, setFilters] = useState(initialFilters); // Reactive filter state

  // ⬇️ NEW STATE FOR MODAL
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const loadJobs = async () => {
    setIsRefreshing(true);
    try {
      // FIX: Pass the current, reactive 'filters' state instead of static 'initialFilters'
      const fetchedJobs = await fetchAvailableJobs(filters);
      setJobs(fetchedJobs);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Data Error",
        text2: error.message || "Failed to load available jobs.",
      });
      setJobs([]);
    } finally {
      setListLoading(false);
      setIsRefreshing(false);
    }
  };

  // The useEffect hook correctly triggers loadJobs whenever filters change
  useEffect(() => {
    loadJobs();
  }, [filters]);

  // const handleApplyForJob = async (jobId, jobTitle) => {
  //   setSelectedJob({ jobId, jobTitle });
  //   setConfirmModalVisible(true);
  // };
  const handleApplyForJob = (jobId, jobTitle) => {
    // Find the full job object
    const job = jobs.find((j) => j.id === jobId);
    setSelectedJobForModal(job);
    setDetailsModalVisible(true);
  };
  const handleSubmitQuote = (job) => {
    setSelectedJobForModal(job);
    setDetailsModalVisible(false);
    setQuoteModalVisible(true);
  };

  const handleQuoteSuccess = () => {
    loadJobs(); // Refresh jobs list
  };

  // ⬇️ NEW CONFIRM HANDLER
  const confirmApply = async () => {
    setConfirmModalVisible(false);

    setListLoading(true);
    const result = await acceptJobRequest(selectedJob.jobId);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Request Submitted",
        text2: "Client must approve before the job starts.",
      });
      loadJobs();
    } else {
      Toast.show({
        type: "error",
        text1: result.error?.message || "Could not process your request.",
      });
      setListLoading(false);
    }
  };

  const renderContent = () => {
    // ... (renderContent remains the same)
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
            No Jobs Available Right Now.
          </Text>
          <Text variant="bodyMedium" style={styles.emptyTextMuted}>
            Check back soon or switch to Provider mode to post your own!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Browse and submit quotes for projects posted by clients.
          </Text>
        </View>
      );
    }

    return (
      <>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            type="worker"
            title={job.title}
            client={job.client}
            date={
              job.deadline_at
                ? `Due: ${new Date(job.deadline_at).toLocaleDateString()}`
                : "Due: N/A"
            }
            location={job.location}
            budget={`$${job.budget.toFixed(2)}`}
            status={job.status}
            onPress={() => handleApplyForJob(job.id, job.title)}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.fullContainer}>
      <JobSearchAndFilter
        currentFilters={filters}
        onFilterChange={setFilters}
        type="worker"
      />
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Available Jobs ({jobs.length})
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Browse and apply for projects posted by clients.
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

      {/* ⬇️ CUSTOM MODERN CONFIRMATION MODAL */}
      {/* <ConfirmationModal
        visible={confirmModalVisible}
        title="Confirm"
        message={
          selectedJob
            ? `Do you want to submit a request to accept "${selectedJob.jobTitle}"? The client must approve.`
            : ""
        }
        confirmText="Accept"
        cancelText="Cancel"
        onConfirm={confirmApply}
        onCancel={() => setConfirmModalVisible(false)}
      /> */}
      {/* Job Details Modal */}
      <JobDetailsModal
        visible={detailsModalVisible}
        job={selectedJobForModal}
        type="worker"
        onClose={() => setDetailsModalVisible(false)}
        onPrimaryAction={() => handleSubmitQuote(selectedJobForModal)}
      />

      {/* Submit Quote Modal */}
      <SubmitQuoteModal
        visible={quoteModalVisible}
        job={selectedJobForModal}
        onClose={() => setQuoteModalVisible(false)}
        onSuccess={handleQuoteSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.surface, // Use light background for contrast
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    // THEME UPDATE: Solid black bottom border for the header
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  title: {
    fontSize: 22,
    fontWeight: "800", // Extra bold for that editorial look
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },

  // Empty State (Matches the JobCard and FormCard style)
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#000000", // Explicit black border
    elevation: 0, // No shadow
    shadowOpacity: 0, // No shadow
  },
  emptyText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase", // Clean, modern label style
  },
  emptyTextMuted: {
    color: COLORS.textMuted,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
});
