import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
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
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            width: "80%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            elevation: 5,
            transform: [{ scale: fadeAnim }],
            opacity: fadeAnim,
          }}
        >
          {/* Cross Button */}
          <TouchableOpacity
            onPress={onCancel}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              padding: 6,
            }}
          >
            <Text style={{ fontSize: 20, color: "#777" }}>✕</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 8,
              paddingRight: 24,
            }}
          >
            {title}
          </Text>

          <Text style={{ fontSize: 15, color: "#555", marginBottom: 24 }}>
            {message}
          </Text>

          {/* Confirm Button */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 18,
                backgroundColor: COLORS.primary,
                borderRadius: 22,
                minWidth: 90,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;
