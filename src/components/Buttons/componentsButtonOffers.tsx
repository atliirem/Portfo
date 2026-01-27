import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  width?: number;
  height?: number;
  label: string;
  bg?: string;
  color?: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export const ComponentButtonOffers = ({
  height = 40,
  width = 105,
  label,
  bg,
  color,
  isSelected,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isSelected ? "#2EC4D6" : bg || "#f6f6f6",
          width,
          height,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: isSelected ? "#fff" : color || "#bababe" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 6,     
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
