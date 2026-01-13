import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  width?: number;
  height: number;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export const PriceComponentsButton = ({
  
  width,
  height,
  label,
  isSelected,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isSelected ? "#eaebec" : "#f6f7f8",
          width,
          height,
        },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: isSelected ? "#000" : "#777", fontWeight: "600" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    
    
  },
});
