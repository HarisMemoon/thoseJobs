// src/screens/Provider/PostJobScreen.js (Clean & Simple Modern UI)
import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Portal, TextInput, Divider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { postJob } from "../../helpers/postJob";
import { COLORS } from "../../constants/Colors";
import SelectModal from "../../components/SelectModal";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import SelectButton from "../../components/SelectButton";
import Toast from "react-native-toast-message";

const CATEGORIES = [
  "Photos",
  "Pickup/Dropoff",
  "Walkthrough",
  "Signange",
  "Other",
];

export default function PostJobScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    location: "",
    budget: "",
    deadline_at: new Date(),
    time_window: "Flexible",
    special_requirements: "",
    media_urls: [],
  });

  const handleChange = (name, value) => {
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || jobDetails.deadline_at;
    setShowDatePicker(false);
    handleChange("deadline_at", currentDate);
  };

  const calculatedTimeWindow = useMemo(() => {
    const today = new Date();
    const deadline = jobDetails.deadline_at;

    const diffMs = deadline - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Immediate (Today)";
    if (diffDays === 1) return "Within 24 Hours";
    if (diffDays <= 7) return `Within ${diffDays} Days`;
    if (diffDays <= 30) return `Within ${Math.round(diffDays / 7)} Weeks`;
    return "Flexible (Long Term)";
  }, [jobDetails.deadline_at]);

  React.useEffect(() => {
    handleChange("time_window", calculatedTimeWindow);
  }, [calculatedTimeWindow]);

  const handlePostJob = async () => {
    if (
      !jobDetails.title ||
      !jobDetails.budget ||
      !jobDetails.location ||
      !jobDetails.description ||
      !jobDetails.category
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields: Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    const result = await postJob(jobDetails);
    setLoading(false);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Your job has been posted! Time Window: ${jobDetails.time_window}`,
      });
      navigation.navigate("My Jobs");
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to Post Job",
        text2: result.error?.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <>
      {/* 1. HEADER SECTION (Outside ScrollView to allow full-width border) */}
      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Post a New Project
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Fill out the details to start the escrow process and hire a worker.
        </Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        {/* <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Post a New Project
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Fill out the details to start the escrow process and hire a worker.
          </Text>
        </View> */}

        {/* Form Card */}
        <View style={{ ...styles.formCard, borderRadius: 12 }}>
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <CustomTextInput
            label="Job Title"
            value={jobDetails.title}
            onChangeText={(text) => handleChange("title", text)}
            maxLength={100}
            required
          />

          <SelectButton
            label="Category"
            value={jobDetails.category}
            onPress={() => setShowCategoryModal(true)}
          />

          <CustomTextInput
            label="Description"
            value={jobDetails.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={4}
            required
          />

          <Divider style={styles.divider} />

          {/* Location & Budget */}
          <Text style={styles.sectionTitle}>Location & Budget</Text>

          <CustomTextInput
            label="Address / Location"
            value={jobDetails.location}
            onChangeText={(text) => handleChange("location", text)}
            required
          />

          <CustomTextInput
            label="Budget (Fixed Price)"
            value={jobDetails.budget}
            onChangeText={(text) =>
              handleChange("budget", text.replace(/[^0-9.]/g, ""))
            }
            keyboardType="numeric"
            left={<TextInput.Affix text="$" />}
            required
          />

          <Divider style={styles.divider} />

          {/* Timeline */}
          <Text style={styles.sectionTitle}>Timeline</Text>

          <SelectButton
            label="Deadline"
            value={jobDetails.deadline_at.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            onPress={() => setShowDatePicker(true)}
          />

          {showDatePicker && (
            <DateTimePicker
              value={jobDetails.deadline_at}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Time Window Display */}
          <View style={styles.timeWindowCard}>
            <Text style={styles.timeWindowLabel}>Estimated Time Window</Text>
            <Text style={styles.timeWindowValue}>{calculatedTimeWindow}</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Additional Details */}
          <Text style={styles.sectionTitle}>Additional Details</Text>

          <CustomTextInput
            label="Special Requirements (Optional)"
            value={jobDetails.special_requirements}
            onChangeText={(text) => handleChange("special_requirements", text)}
            multiline
            numberOfLines={3}
          />

          <CustomButton
            type="secondary"
            title="Attach Reference Images"
            icon="camera"
            onPress={() => {
              Toast.show({
                type: "info",
                text1: "Upload Feature",
                text2: "Image upload coming soon.",
              });
            }}
          />
          {/* Submit Button */}
          <CustomButton
            type="primary"
            title="Post Job & Start Escrow"
            icon="check"
            onPress={handlePostJob}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      <Portal>
        <SelectModal
          visible={showCategoryModal}
          onDismiss={() => setShowCategoryModal(false)}
          onSelect={(category) => handleChange("category", category)}
          title="Select Job Category"
          selectedItem={jobDetails.category}
          items={CATEGORIES}
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  // 🌟 NEW: Header container sits above the ScrollView
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    // This creates the full-width solid black line
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  contentContainer: {
    padding: 20, // Padding for the cards inside
  },
  title: {
    fontSize: 22, // Adjusted for hierarchy
    fontWeight: "900", // Extra bold
    color: "#000000",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#000000",
    overflow: "hidden",
    elevation: 0,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    // Clean professional look
    letterSpacing: 1,
  },
  divider: {
    marginVertical: 10,
    height: 1.5,
    backgroundColor: "#000000",
  },
  timeWindowCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderStyle: "dashed",
  },
  timeWindowLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",

    marginBottom: 4,
  },
  timeWindowValue: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "800",
  },
  submitButton: {
    marginTop: 10,
  },
});
