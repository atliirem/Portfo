import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@react-native-vector-icons/ionicons";

interface MapData {
  latitude: string | null;
  longitude: string | null;
}

interface CompanyMapProps {
  location: MapData | null | undefined;
}

const PropertyMap = ({ location }: CompanyMapProps) => {
  const hasLocation = location?.latitude && location?.longitude;
  const lat = hasLocation ? parseFloat(location.latitude!) : null;
  const lng = hasLocation ? parseFloat(location.longitude!) : null;

  // Koordinat yoksa bilgi göster
  if (!hasLocation || !lat || !lng) {
    return (
      <View style={styles.noMapCard}>
        <Ionicons name="map-outline" size={60} color="#ccc" />
        <Text style={styles.noMapText}>Harita koordinatı bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title="Firma Konumu"
        />
      </MapView>
    </View>
  );
};

export default PropertyMap;

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  map: {
    flex: 1,
  },
  noMapCard: {
    height: 250,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  noMapText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
  },
});