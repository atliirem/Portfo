import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LogoSmall from "../components/LogoSmall";
import { StatusBar } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";


export default function Top() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
     // style="dark" backgroundColor="#FFFFFF" translucent={false} 
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.file}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={30} color="#1a8b95" />
        </TouchableOpacity>

        <LogoSmall />

        <TouchableOpacity
          style={styles.notif}
          onPress={() => navigation.navigate("DetailAlerts" as never)}
        >
          <Ionicons name="notifications-outline" size={30} color="#1a8b95" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffffff',
    top: '0%'
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    height: 30,
    shadowOpacity: 0,
    elevation: 0,
    top: 15,
  },
  notif: {
    top: -15,
    left: 0,
  },
  file: {
    top: -15,
    left: 0,
  },
});