// src/screens/Worker/JobsScreen.js
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

// ⬇️ NEW IMPORT
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "react-native-toast-message";

export default function JobsScreen() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ⬇️ NEW STATE FOR MODAL
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const loadJobs = async () => {
    setIsRefreshing(true);
    try {
      const fetchedJobs = await fetchAvailableJobs();
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

  useEffect(() => {
    loadJobs();
  }, []);

  const handleApplyForJob = async (jobId, jobTitle) => {
    setSelectedJob({ jobId, jobTitle });
    setConfirmModalVisible(true);
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
            date={`Due: ${new Date(job.deadline_at).toLocaleDateString()}`}
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
      <ConfirmationModal
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentHighlight,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 5,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
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
  emptyText: {
    color: COLORS.textDark,
    fontWeight: "700",
    marginBottom: 5,
  },
  emptyTextMuted: {
    color: COLORS.textMuted,
    textAlign: "center",
  },
});
