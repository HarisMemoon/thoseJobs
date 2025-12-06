// src/screens/Provider/MyJobsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { becomeWorker } from "../../helpers/becomeWorker";
import { fetchProviderJobs } from "../../helpers/fetchProviderJobs";
import { approveJobAssignment } from "../../helpers/approveJobAssignment";
import JobCard from "../../components/JobCard";
import { COLORS } from "../../constants/Colors";
import Toast from "react-native-toast-message";

// ⬇️ NEW IMPORT
import ConfirmationModal from "../../components/ConfirmationModal";

export default function MyJobsScreen() {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // ⬇️ NEW STATE FOR CONFIRMATION MODAL
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const loadJobs = async () => {
    setIsRefreshing(true);
    try {
      const fetchedJobs = await fetchProviderJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Data Error",
        text2: error.message || "Failed to load your posted jobs.",
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

  // ⬇️ OPEN CUSTOM MODAL INSTEAD OF Alert.alert
  const handleApproveJob = (jobId) => {
    setSelectedJobId(jobId);
    setConfirmModalVisible(true);
  };

  // ⬇️ CONFIRM HANDLER
  const confirmApproval = async () => {
    setConfirmModalVisible(false);
    setIsRefreshing(true);

    const result = await approveJobAssignment(selectedJobId);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Assignment Approved!",
        text2:
          "The job is now officially accepted by the worker and is in progress.",
      });
      loadJobs();
    } else {
      Toast.show({
        type: "error",
        text1: "Approval Failed",
        text2: result.error.message,
      });
      setIsRefreshing(false);
    }
  };

  const handleJobAction = (job) => {
    if (job.status === "submitted") {
      handleApproveJob(job.id);
    } else {
      console.log("Navigating to Job Management for:", job.id);
    }
  };

  const handleSwitchToWorker = async () => {
    setIsSwitching(true);
    await becomeWorker();
    setIsSwitching(false);
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
            You haven't posted any jobs yet.
          </Text>
          <Text variant="bodyMedium" style={styles.emptyTextMuted}>
            Use the 'Post a Job' tab to get started!
          </Text>
        </View>
      );
    }

    return (
      <>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            type="provider"
            title={job.title}
            worker={job.worker}
            date={`Posted: ${new Date(job.created_at).toLocaleDateString()}`}
            location={job.location}
            budget={`$${job.budget.toFixed(2)}`}
            status={job.status}
            onPress={() => handleJobAction(job)}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          My Posted Projects ({jobs.length})
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Manage job details, applicants, and escrow payouts.
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
        title="Final Approval"
        message="Are you sure you want to approve this worker and begin the job?"
        confirmText="Approve & Start"
        cancelText="Cancel"
        onConfirm={confirmApproval}
        onCancel={() => setConfirmModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 5,
    fontSize: 12,
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
