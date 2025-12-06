import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CategoryCard({ title }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
  },
});
