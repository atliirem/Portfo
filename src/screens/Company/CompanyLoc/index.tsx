import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "@react-native-vector-icons/ionicons";
import { RootState } from "../../../redux/store";
import PropertyMap from "../../../components/MapComponents";
import { ComponentButton } from "../../../components/Buttons/componentsButton";

type LocationTabKey = "address" | "map";

const CompanyLoc = () => {
  const [activeTab, setActiveTab] = useState<LocationTabKey>("address");

  const { selectedCompany, loading } = useSelector((state: RootState) => state.company);

  const locationData = selectedCompany?.locations?.[0];
  const address = locationData?.address;
  const mapData = locationData?.map;

  const tabs = [
    { key: "address", label: "Adres" },
    { key: "map", label: "Harita Konumu" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
        <Text style={styles.loadingText}>Konum bilgisi yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
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
        <View style={styles.mapContainer}>
          {mapData?.latitude && mapData?.longitude ? (
            <PropertyMap
              location={{
                latitude: mapData.latitude.toString(),
                longitude: mapData.longitude.toString(),
              }}
            />
          ) : (
            <View style={styles.noMapCard}>
              <Ionicons name="map-outline" size={40} color="#ccc" />
              <Text style={styles.noMapText}>Harita konumu bulunamadı</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CompanyLoc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
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
    marginHorizontal: 5,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },
  mapContainer: {
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  noMapCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  noMapText: {
    fontSize: 14,
    color: "#999",
    marginTop: 15,
  },
});