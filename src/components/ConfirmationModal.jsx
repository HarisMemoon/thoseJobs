import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

const ConfirmationModal = ({
  visible,
  title = "Are you sure?",
  message = "Do you want to continue?",
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <Animated.View
          style={[
            styles.modalCard,
            {
              transform: [
                { scale: fadeAnim },
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Close Icon Box */}
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Icon name="close" size={18} color="#000" />
          </TouchableOpacity>

          {/* Title with Cyber Lime Accent */}
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <Text style={styles.messageText}>{message}</Text>

          {/* Action Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
              <Icon name="check-bold" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    // Neo-Brutalist Shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 6, height: 6 },
    // shadowOpacity: 1,
    // shadowRadius: 0,
    // elevation: 10,
  },
  closeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 6,

    borderRadius: 8,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 30,
  },
  accentBar: {
    width: 4,
    height: 24,
    backgroundColor: COLORS.secondary, // Cyber Lime
    marginRight: 10,
    borderRadius: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000",
    textTransform: "uppercase",
  },
  messageText: {
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    // Small button shadow
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  confirmBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});

export default ConfirmationModal;
