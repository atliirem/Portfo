import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LogoSmall from "../components/LogoSmall";
import Ionicons from '@react-native-vector-icons/ionicons';
import SelectCustomerModal from '../screens/SelectCustomerModal';
import { getCustomer, getProperties } from '../utils/offeresStorage';

export default function TopTabs() {
  const navigation = useNavigation();
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [propertyCount, setPropertyCount] = useState(0);


  const loadData = useCallback(async () => {
    const customer = await getCustomer();
    const properties = await getProperties();
    setSelectedCustomer(customer);
    setPropertyCount(properties.length);
  }, []);


  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );


  const handleCustomerSelect = async (code: string, name: string) => {
    console.log("Seçilen müşteri kodu:", code);
    console.log("Seçilen müşteri adı:", name);
    

    await loadData();
  };


  const handleModalClose = async () => {
    setCustomerModalVisible(false);
    
    setTimeout(() => {
      loadData();
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={styles.container}>
        {selectedCustomer ? (
          <TouchableOpacity
            style={styles.notif}
            onPress={() => navigation.navigate("SelectedPropertiesScreen" as never)}
          >
            <View>
              <Ionicons name="folder" size={30} color="#25C5D1" />
              {propertyCount > 0 && (
                <View style={styles.badge}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.notif}
            onPress={() => setCustomerModalVisible(true)}
          >
            <Ionicons name="folder-outline" size={30} color="#1a8b95" />
          </TouchableOpacity>
        )}

        <LogoSmall />

        <TouchableOpacity
          style={styles.notif}
          onPress={() => navigation.navigate("DetailAlerts" as never)}
        >
          <Ionicons name="notifications-outline" size={30} color="#1a8b95" />
        </TouchableOpacity>
      </View>

      <SelectCustomerModal
        visible={customerModalVisible}
        onClose={handleModalClose}
        onSelect={handleCustomerSelect}
      />
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
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#25C5D1",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});