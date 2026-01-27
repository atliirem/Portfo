import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type Props = {
  label: string;
  bg?: string;
  color?: string;
  onPress?: () => void;
};

export const AccountItems = ({ label, bg, color, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bg ?? "transparent" },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: color ?? "#000" }]}>
        {label}
      </Text>

      <Ionicons
        name="chevron-forward-outline"
        size={23}
        color="#a9a9a9"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.8,
    borderBottomColor: "#c4c4c4",
    padding: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "800",
  },
});
