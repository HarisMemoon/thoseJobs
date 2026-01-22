import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Modal, Portal, Text, Divider, TextInput } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import CustomTextInput from "./CustomTextInput";
import CustomButton from "./CustomButton";
import { supabase } from "../utils/supabase";
import Toast from "react-native-toast-message";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SubmitQuoteModal({ visible, job, onClose, onSuccess }) {
  const [quoteAmount, setQuoteAmount] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setQuoteAmount("");
    setProposedTimeline("");
    setMessage("");
  };

  const handleSubmitQuote = async () => {
    if (!quoteAmount || parseFloat(quoteAmount) <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: "Please enter a valid quote amount.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to submit a quote.");
      }

      const { error } = await supabase.from("quotations").insert({
        job_id: job.id,
        worker_id: user.id,
        quoted_amount: parseFloat(quoteAmount),
        proposed_timeline: proposedTimeline || null,
        message: message || null,
        status: "pending",
      });
      // 2. UPDATE THE JOB ARRAY (The new fix)
      // This adds the worker's ID to the array in the jobs table
      const { error: jobUpdateError } = await supabase.rpc(
        "append_quoted_worker",
        {
          job_id: job.id,
          new_worker_id: user.id,
        }
      );
      if (jobUpdateError) throw jobUpdateError;
      if (error) {
        // Check for unique constraint violation
        if (error.code === "23505") {
          throw new Error("You have already submitted a quote for this job.");
        }
        throw error;
      }

      Toast.show({
        type: "success",
        text1: "Quote Submitted!",
        text2: "The client will review your quotation.",
      });

      resetForm();
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error.message || "Could not submit your quote.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!job) return null;

  const { title, budget, category, deadline_at } = job;

  // Calculate platform fee (30%)
  const platformFeePercentage = 30;
  const potentialEarnings = quoteAmount
    ? ((parseFloat(quoteAmount) * (100 - platformFeePercentage)) / 100).toFixed(
        2
      )
    : "0.00";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
        style={styles.modal}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleClose}
          activeOpacity={1}
        />

        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Close Icon */}
          <TouchableOpacity onPress={handleClose} style={styles.closeIconBox}>
            <Icon name="close" size={20} color="#000" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.fixDiv}>
                <View style={styles.iconBadge}>
                  <Icon name="currency-usd" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.titleText}>Submit Quote</Text>
              </View>

              <Text style={styles.subtitle}>
                Enter your quote amount and optional message for this job.
              </Text>
            </View>

            <Divider style={styles.heavyDivider} />

            {/* Job Info Card */}
            <View style={styles.jobInfoCard}>
              <Text style={styles.jobTitle}>{title}</Text>
              <View style={styles.jobMetrics}>
                <View style={styles.jobMetricItem}>
                  <Text style={styles.metricLabel}>Job Budget</Text>
                  <Text style={styles.metricValue}>${budget}</Text>
                </View>
                <View style={styles.jobMetricItem}>
                  <Icon name="shape" size={16} color={COLORS.textMuted} />
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.lightDivider} />

            {/* Quote Amount Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quote Amount (USD) *</Text>
              <CustomTextInput
                value={quoteAmount}
                onChangeText={(text) =>
                  setQuoteAmount(text.replace(/[^0-9.]/g, ""))
                }
                keyboardType="numeric"
                placeholder="99.98"
                left={<TextInput.Affix text="$" />}
              />
              <Text style={styles.helperText}>
                Enter the amount you'd like to receive for completing this job.
              </Text>
            </View>

            {/* Proposed Timeline Input */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Proposed Timeline (Optional)
              </Text>
              <CustomTextInput
                value={proposedTimeline}
                onChangeText={setProposedTimeline}
                placeholder="e.g., 2-3 days, Within 1 week"
              />
              <Text style={styles.helperText}>
                When can you complete this job?
              </Text>
            </View> */}

            {/* Message Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Message (Optional)</Text>
              <CustomTextInput
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                placeholder="Tell the requester why you're the best fit for this job..."
              />
              <Text style={styles.helperText}>
                Add a message to explain your quote and highlight your
                experience.
              </Text>
            </View>

            {/* Platform Fee Breakdown */}
            {quoteAmount && parseFloat(quoteAmount) > 0 && (
              <View style={styles.feeCard}>
                <View style={styles.feeHeader}>
                  <Icon name="information" size={20} color={COLORS.primary} />
                  <Text style={styles.feeTitle}>Platform Fee Breakdown</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Your Quote</Text>
                  <Text style={styles.feeValue}>
                    ${parseFloat(quoteAmount).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>
                    Platform Fee ({platformFeePercentage}%)
                  </Text>
                  <Text style={styles.feeValue}>
                    -$
                    {(
                      (parseFloat(quoteAmount) * platformFeePercentage) /
                      100
                    ).toFixed(2)}
                  </Text>
                </View>
                <Divider style={styles.feeDivider} />
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabelBold}>You'll Receive</Text>
                  <Text style={styles.feeValueBold}>${potentialEarnings}</Text>
                </View>
                <Text style={styles.feeNote}>
                  A {platformFeePercentage}% platform fee will be deducted from
                  your quote amount.
                </Text>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Fixed Footer */}
          <View style={styles.footer}>
            <CustomButton
              type="secondary"
              title="Cancel"
              onPress={handleClose}
              disabled={submitting}
              style={styles.cancelButton}
            />
            <CustomButton
              type="primary"
              title="Submit Quote"
              onPress={handleSubmitQuote}
              loading={submitting}
              disabled={submitting || !quoteAmount}
              style={styles.submitButton}
            />
          </View>
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
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
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  fixDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 8,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  heavyDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  lightDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 20,
  },

  // Job Info Card
  jobInfoCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    marginBottom: 12,
  },
  jobMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobMetricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },

  // Fee Card
  feeCard: {
    backgroundColor: `${COLORS.primary}10`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    marginTop: 10,
  },
  feeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  feeLabelBold: {
    fontSize: 16,
    color: "#000",
    fontWeight: "800",
  },
  feeValueBold: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "900",
  },
  feeDivider: {
    height: 1,
    backgroundColor: `${COLORS.primary}30`,
    marginVertical: 8,
  },
  feeNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
    fontStyle: "italic",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});
