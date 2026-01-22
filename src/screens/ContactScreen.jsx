import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";
import CustomTextInput from "../components/CustomTextInput";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    question: "How does the Escrow system work?",
    answer:
      "When a job starts, the provider's funds are locked in our secure system. Once the worker submits the work and the provider approves it, the funds are instantly released to the worker.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "We keep it simple: a flat 5% fee is applied to the total job budget to cover secure transaction processing and platform maintenance.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "Go to your Earnings tab and click 'Withdraw'. Funds are usually transferred to your linked account within minutes, depending on your bank.",
  },
];

export default function ContactScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 1. INTERACTIVE HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.pageHeader}>GET IN{"\n"}TOUCH.</Text>
          <View style={styles.brandBlob}>
            <Icon name="message-text-fast" size={32} color={COLORS.textDark} />
          </View>
        </View>

        {/* 2. FAQ SECTION */}
        <Text style={styles.sectionLabel}>Frequently Asked</Text>
        {FAQ_DATA.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => toggleExpand(index)}
            style={[
              styles.faqCard,
              expandedIndex === index && styles.faqCardExpanded,
            ]}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Icon
                name={expandedIndex === index ? "minus" : "plus"}
                size={20}
                color={COLORS.textDark}
              />
            </View>
            {expandedIndex === index && (
              <View>
                <Divider style={styles.faqDivider} />
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* 3. CONTACT FORM */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <View style={styles.formIconBox}>
              <Icon
                name="email-fast-outline"
                size={24}
                color={COLORS.textDark}
              />
            </View>
            <Text style={styles.formTitle}>Drop a Message</Text>
          </View>

          <CustomTextInput label="Your Name" placeholder="Full Name" required />
          <CustomTextInput
            label="Email Address"
            placeholder="email@example.com"
            keyboardType="email-address"
            required
          />
          <CustomTextInput
            label="Message"
            placeholder="Tell us what you need..."
            multiline
            numberOfLines={4}
            required
          />

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
            <Icon name="send-check" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>

        {/* 4. SOCIAL LINKS */}
        <View style={styles.socialRow}>
          {["twitter", "instagram", "linkedin"].map((social) => (
            <TouchableOpacity key={social} style={styles.socialIcon}>
              <Icon name={social} size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20 },

  // HEADER
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  pageHeader: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.textDark,
    lineHeight: 42,
  },
  brandBlob: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.secondary, // Amber/Yellow
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-8deg" }],
    // Neo-Shadow
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },

  // FAQ SECTION
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
    color: COLORS.textMuted,
  },
  faqCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  faqCardExpanded: {
    backgroundColor: COLORS.yellow, // Light yellow background when open
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  faqDivider: {
    marginVertical: 12,
    backgroundColor: "#000",
    height: 1.5,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    fontWeight: "600",
  },

  // FORM CONTAINER
  formContainer: {
    marginTop: 20,
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    // Primary Blue Offset Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  formIconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textDark,
    textTransform: "uppercase",
  },
  sendButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginTop: 10,
    gap: 10,
    // Small shadow on button
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.textDark,
  },

  // SOCIAL
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 30,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
});
