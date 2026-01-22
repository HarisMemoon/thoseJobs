import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Modal, Portal, Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import { supabase } from "../utils/supabase";
import Toast from "react-native-toast-message";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function JobDetailsModal({
  visible,
  job,
  type,
  onClose,
  onPrimaryAction,
}) {
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);

  useEffect(() => {
    if (visible && job && type === "provider" && job.status === "posted") {
      fetchQuotations();
    }
  }, [visible, job]);

  const fetchQuotations = async () => {
    if (!job?.id) return;

    setLoadingQuotations(true);
    try {
      const { data, error } = await supabase
        .from("quotations")
        .select(
          `
          id,
          quoted_amount,
          proposed_timeline,
          message,
          status,
          created_at,
          worker:worker_id (
            id,
            username
          )
        `
        )
        .eq("job_id", job.id)
        .order("created_at", { ascending: false })
        .eq("status", "pending");

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleAcceptQuotation = async (quotationId, workerId) => {
    try {
      // Update quotation status to accepted
      const { error: quotationError } = await supabase
        .from("quotations")
        .update({ status: "accepted" })
        .eq("id", quotationId);

      if (quotationError) throw quotationError;

      // Update job with worker and change status to submitted
      const { error: jobError } = await supabase
        .from("jobs")
        .update({
          worker_id: workerId,
          status: "accepted",
        })
        .eq("id", job.id);

      if (jobError) throw jobError;

      // Reject other quotations
      await supabase
        .from("quotations")
        .update({ status: "rejected" })
        .eq("job_id", job.id)
        .neq("id", quotationId);

      // Refresh quotations
      await fetchQuotations();

      // Call parent action if needed
      if (onPrimaryAction) {
        onPrimaryAction(job.id, job.title);
      }
    } catch (error) {
      console.error("Error accepting quotation:", error);
    }
  };
  const handleRejectQuotation = async (quotationId) => {
    try {
      // 1. Update the specific quotation status to 'rejected'
      const { error } = await supabase
        .from("quotations")
        .update({ status: "rejected" })
        .eq("id", quotationId);

      if (error) throw error;

      // 2. Refresh the UI to show the updated status
      await fetchQuotations();

      Toast.show({
        type: "info",
        text1: "Quotation Rejected",
        text2: "The worker has been notified.",
      });
    } catch (error) {
      console.error("Error rejecting quotation:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not reject the quotation.",
      });
    }
  };

  if (!job) return null;

  const {
    id,
    title,
    description,
    location,
    budget,
    status,
    deadline_at,
    created_at,
    client,
    worker,
    category,
    special_requirements,
  } = job;

  // Get status color based on status
  const getStatusColor = () => {
    switch (status) {
      case "posted":
        return "#3B82F6"; // Blue
      case "submitted":
        return "#FACC15"; // Yellow
      case "accepted":
        return "#34D399"; // Green
      case "completed":
        return "#8B5CF6"; // Purple
      case "disputed":
        return "#EF4444"; // Red
      case "paid":
        return "#10B981"; // Dark Green
      default:
        return "#6B7280"; // Gray
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        {/* Backdrop to close when tapping outside */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.sheetContainer}>
          {/* DRAG HANDLE INDICATOR */}
          <View style={styles.dragHandle} />

          {/* Absolute Close Icon */}
          <TouchableOpacity onPress={onClose} style={styles.closeIconBox}>
            <Icon name="close" size={20} color="#000" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.titleText}>{title}</Text>
              <View style={styles.statusRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {category.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor() },
                    ]}
                  />
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.heavyDivider} />

            {/* Metrics Grid */}
            <View style={styles.metricGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>BUDGET</Text>
                <Text style={styles.metricValue}>${budget}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>DEADLINE</Text>
                <Text style={styles.metricValue}>
                  {new Date(deadline_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>LOCATION</Text>
                <Text style={[styles.metricValue, { fontSize: 14 }]}>
                  {location}
                </Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>POSTED ON</Text>
                <Text style={[styles.metricValue, { fontSize: 14 }]}>
                  {new Date(created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <Divider style={styles.heavyDivider} />

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Job Description</Text>
              <Text style={styles.bodyText}>{description}</Text>
            </View>

            {special_requirements && (
              <View style={[styles.section, styles.specialSection]}>
                <Text style={styles.sectionHeading}>Special Instructions</Text>
                <Text style={styles.bodyText}>{special_requirements}</Text>
              </View>
            )}

            {/* Quotations Section - Only for provider viewing posted jobs */}
            {type === "provider" && status === "posted" && (
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>
                  Worker Quotations ({quotations.length})
                </Text>

                {loadingQuotations ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>
                      Loading quotations...
                    </Text>
                  </View>
                ) : quotations.length === 0 ? (
                  <View style={styles.emptyQuotations}>
                    <Icon name="inbox" size={48} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>
                      No quotations received yet
                    </Text>
                  </View>
                ) : (
                  quotations.map((quote) => (
                    <View key={quote.id} style={styles.quotationCard}>
                      <View style={styles.quotationHeader}>
                        <View style={styles.workerInfo}>
                          <Icon
                            name="account-circle"
                            size={40}
                            color={COLORS.primary}
                          />
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.workerName}>
                              {quote.worker?.username || "Unknown Worker"}
                            </Text>
                            <Text style={styles.quotationDate}>
                              {new Date(quote.created_at).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.quotationAmount}>
                          <Text style={styles.amountLabel}>Quote</Text>
                          <Text style={styles.amountValue}>
                            ${quote.quoted_amount}
                          </Text>
                        </View>
                      </View>

                      {quote.proposed_timeline && (
                        <View style={styles.quotationDetail}>
                          <Icon
                            name="clock-outline"
                            size={16}
                            color={COLORS.textMuted}
                          />
                          <Text style={styles.detailText}>
                            Timeline: {quote.proposed_timeline}
                          </Text>
                        </View>
                      )}

                      {quote.message && (
                        <View style={styles.quotationMessage}>
                          <Text style={styles.messageText}>
                            {quote.message}
                          </Text>
                        </View>
                      )}

                      {quote.status === "pending" && (
                        <TouchableOpacity
                          style={styles.acceptButton}
                          onPress={() =>
                            handleAcceptQuotation(quote.id, quote.worker.id)
                          }
                        >
                          <Icon name="check-circle" size={20} color="#000" />
                          <Text style={styles.acceptButtonText}>Approve</Text>
                        </TouchableOpacity>
                      )}
                      {quote.status === "pending" && (
                        <TouchableOpacity
                          style={styles.rejectButton}
                          onPress={() =>
                            handleRejectQuotation(quote.id, quote.worker.id)
                          }
                        >
                          <Icon name="cancel" size={20} color="#000" />
                          <Text style={styles.acceptButtonText}>Reject</Text>
                        </TouchableOpacity>
                      )}

                      {quote.status === "accepted" && (
                        <View style={styles.acceptedBadge}>
                          <Icon
                            name="check-decagram"
                            size={16}
                            color="#10B981"
                          />
                          <Text style={styles.acceptedText}>Accepted</Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}

            {/* Worker Info - Show for non-posted jobs */}
            {type === "worker" && status === "posted" && (
              <View style={styles.quoteTriggerBox}>
                <TouchableOpacity
                  onPress={() => onPrimaryAction(job.id)}
                  style={styles.quoteTriggerButton}
                >
                  <Icon name="currency-usd" size={20} color="#000" />
                  <Text style={styles.quoteTriggerText}>Quote</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },

  sheetContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000000",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 12,
  },
  closeIconBox: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    lineHeight: 32,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#000",
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#000",
  },

  heavyDivider: {
    height: 2,
    backgroundColor: "#000",
    marginVertical: 20,
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricBox: {
    width: "47%",
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginTop: 2,
  },

  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  bodyText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    fontWeight: "500",
  },

  specialSection: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "dashed",
  },

  // Quotations Styles
  quoteTriggerBox: {
    marginTop: 16,
  },

  quoteTriggerButton: {
    height: 36,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  quoteTriggerText: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  emptyQuotations: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  quotationCard: {
    backgroundColor: COLORS.lightPurple,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 12,
  },
  quotationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  quotationDate: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  quotationAmount: {
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000",
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  quotationDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  quotationMessage: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 22,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#000",
    gap: 8,
  },
  rejectButton: {
    backgroundColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 22,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#000",
    gap: 8,
  },
  acceptButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  acceptedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#10B981",
    gap: 8,
  },
  acceptedText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  workerInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  boldText: {
    fontWeight: "800",
    fontSize: 16,
  },
});
