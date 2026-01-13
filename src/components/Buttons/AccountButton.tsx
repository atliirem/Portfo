import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type Props = {
 
  label: string;
  bg?: string;
  color?: string;
  onPress?: () => void;
};

export const AccountItems = ({  label, bg, color, onPress }: Props) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.8, borderBottomColor: '#c4c4c4', padding: 10, 
    }}>
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg,  }]} 
      onPress={onPress}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
     
    </TouchableOpacity>
  <TouchableOpacity style={{justifyContent: 'center'}}>
     <Ionicons name="chevron-forward-outline" size={23} color={'#a9a9a9ff'}/>
     </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
    borderRadius: 7,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
   
  },
  text: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000ff",
  },
});