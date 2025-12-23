import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  width?: number;
  height: number;
  label: string;
  bg?: string;
  color?: string;
  marginTop: number;
  isSelected?: boolean;
  onPress?: () => void;
};

export const ComponentButtonOffers = ({
  marginTop,
  height,
  width,
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
          backgroundColor: isSelected ? "white" : bg || "#f6f6f6",
          width,
          height,
          marginTop,
        
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { 
        color: isSelected ? "#ffff" : "#bababe"
         }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 6,
    borderRadius: 4.2,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff"
  
  },
});