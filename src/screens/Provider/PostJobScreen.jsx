// src/screens/Provider/PostJobScreen.js (Updated with Custom Components)
import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Portal, TextInput, Button } from "react-native-paper"; // Removed TextInput, Button
import DateTimePicker from "@react-native-community/datetimepicker";
import { postJob } from "../../helpers/postJob";
import { COLORS } from "../../constants/Colors";
import SelectModal from "../../components/SelectModal";
import CustomTextInput from "../../components/CustomTextInput"; // NEW IMPORT
import CustomButton from "../../components/CustomButton"; // NEW IMPORT
import Toast from "react-native-toast-message";

const CATEGORIES = [
  "Property Inspection",
  "Minor Maintenance",
  "Delivery",
  "Moving Assistance",
  "Gutter Cleaning",
  "Signage Maintenance",
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
      <ScrollView
        style={[styles.container, { backgroundColor: COLORS.backgroundLight }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Post a New Project
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Fill out the details below to start the escrow process and hire a
          worker.
        </Text>
        {/* --- CUSTOM TEXT INPUTS --- */}

        <CustomTextInput
          label="Job Title"
          value={jobDetails.title}
          onChangeText={(text) => handleChange("title", text)}
          maxLength={100}
        />

        <CustomTextInput
          label="Description "
          value={jobDetails.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        <CustomTextInput
          label="Address / Location"
          value={jobDetails.location}
          onChangeText={(text) => handleChange("location", text)}
        />

        <CustomTextInput
          label="Budget (Fixed Price)"
          value={jobDetails.budget}
          onChangeText={(text) =>
            handleChange("budget", text.replace(/[^0-9.]/g, ""))
          }
          keyboardType="numeric"
          left={<TextInput.Affix text="$" />}
        />

        <CustomTextInput
          label="Special Requirements (Optional)"
          value={jobDetails.special_requirements}
          onChangeText={(text) => handleChange("special_requirements", text)}
        />
        {/* --- End Custom Text Inputs --- */}
        {/* --- Category Dropdown Button (Uses base Button with custom styling) --- */}

        <Button
          mode="outlined"
          onPress={() => setShowCategoryModal(true)}
          icon="shape"
          style={styles.categoryInput}
          labelStyle={styles.categoryInputLabel}
        >
          Category: {jobDetails.category}
        </Button>
        {/* --- Deadline Button --- */}
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          icon="calendar-clock"
          style={styles.categoryInput}
          labelStyle={styles.categoryInputLabel}
        >
          Deadline: {jobDetails.deadline_at.toLocaleDateString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={jobDetails.deadline_at}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
        {/* --- Dynamic Time Window Display --- */}
        <View style={[styles.input, styles.timeWindowDisplay]}>
          <Text style={{ fontWeight: "600", color: COLORS.textDark }}>
            Time Window:
          </Text>

          <Text
            style={{
              color: COLORS.secondary,
              fontWeight: "700",
              marginLeft: 5,
            }}
          >
            {calculatedTimeWindow}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* --- Custom Secondary Button (Upload) --- */}

          <CustomButton
            type="secondary"
            title="Attach Reference Images"
            icon="camera"
            onPress={() => {
              Toast.show({
                type: "success",
                text1: "Upload Feature",
                text2: "Image upload coming soon.",
              });
            }}
            style={styles.uploadButtonOverride}
          />
          {/* --- Custom Primary Button (Submit) --- */}

          <CustomButton
            type="primary"
            title="Post Job"
            onPress={handlePostJob}
            loading={loading}
            disabled={loading}
            style={styles.submitButtonOverride}
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
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontWeight: "700", marginBottom: 5, color: COLORS.textDark },
  subtitle: { marginBottom: 20, color: COLORS.textMuted },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.accentHighlight,
  }, // Specific styling for the Category/Deadline buttons to mimic TextInput border/padding
  categoryInput: {
    marginBottom: 15,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.accentHighlight,
    borderRadius: 5,
    borderWidth: 1, // Needed to mimic outlined mode border
  },
  // Apply specific label styling needed for custom buttons
  categoryInputLabel: {
    color: COLORS.textDark,
    textAlign: "left",
    flex: 1,
    paddingLeft: 10,
    fontSize: 15, // Match text input size
    justifyContent: "flex-start",
    fontWeight: "normal",
  },
  timeWindowDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.accentHighlight,
    marginBottom: 15,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    marginTop: 20,
    gap: 15,
  },
  // Overrides to match the exact spacing/shape from original styles, but uses CustomButton logic
  uploadButtonOverride: {
    backgroundColor: COLORS.accentHighlight,
  },
  submitButtonOverride: {
    // No explicit style needed here as CustomButton handles the primary styling
  },
});
