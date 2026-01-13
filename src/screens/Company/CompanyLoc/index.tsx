import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "@react-native-vector-icons/ionicons";
import { RootState } from "../../../redux/store";
import PropertyMap from "../../../components/MapComponents";
import { ComponentButton } from "../../../components/Buttons/componentsButton";

type LocationTabKey = "address" | "map";

const CompanyLoc = () => {
  const [activeTab, setActiveTab] = useState<LocationTabKey>("address");

  const { selectedCompany } = useSelector((state: RootState) => state.company);

  const address = selectedCompany?.locations?.[0]?.address;
  const mapData = selectedCompany?.locations?.[0]?.map;

  const tabs = [
    { key: "address", label: "Adres" },
    { key: "map", label: "Harita Konumu" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {tabs.map((tab) => (
          <ComponentButton
            key={tab.key}
            label={tab.label}
            isSelected={activeTab === tab.key}
            height={40}
            width={140}
            marginTop={0}
            onPress={() => setActiveTab(tab.key as LocationTabKey)}
          />
        ))}
      </View>

      {activeTab === "address" && (
        <View style={styles.card}>
          <Ionicons name="location" size={40} color="#25C5D1" />
          <Text style={styles.addressText}>
            {address || "Adres bilgisi bulunamadı"}
          </Text>
        </View>
      )}

      {activeTab === "map" && (
        <PropertyMap
          location={{
            latitude: mapData?.latitude?.toString() || null,
            longitude: mapData?.longitude?.toString() || null,
          }}
        />
      )}
    </View>
  );
};

export default CompanyLoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    marginTop: -550
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },
});