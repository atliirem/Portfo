import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  width?:  number; 
  height: number;
  label: string;
  bg?: string;
  color?: string;


  marginTop: number;
  onPress?: () => void;
};

export const ProfileButton = ({  marginTop,height , width, label, bg, color, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg, width , height, marginTop }]} 
      onPress={onPress}
    >
      <Text style={[styles.text, { color, }]}>{label}</Text>
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
     fontWeight: 800,
    color: "#000000ff",
    
  },
});