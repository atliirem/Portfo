import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@react-native-vector-icons/ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

interface MapData {
  latitude: string | null;
  longitude: string | null;
}

interface PropertyMapProps {
  location: MapData | null | undefined;
  editable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: number;
}

const isValidNum = (v: any) => v !== null && v !== undefined && v !== "" && !isNaN(Number(v));

const PropertyMap = ({
  location,
  editable = false,
  onLocationChange,
  height = 350,
}: PropertyMapProps) => {
  const hasValidLocation =
    isValidNum(location?.latitude) &&
    isValidNum(location?.longitude);

  const initialLat = hasValidLocation ? Number(location!.latitude) : null;
  const initialLng = hasValidLocation ? Number(location!.longitude) : null;

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat !== null && initialLng !== null ? { lat: initialLat, lng: initialLng } : null
  );

  const [mapReady, setMapReady] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (initialLat !== null && initialLng !== null) {
      setMarkerPosition({ lat: initialLat, lng: initialLng });
    } else if (!editable) {
      setMarkerPosition(null);
    }
  }, [initialLat, initialLng, editable]);

  // Hint'i 5 saniye sonra otomatik gizle
  useEffect(() => {
    if (editable && showHint) {
      const timer = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [editable, showHint]);

  if (!markerPosition && !editable) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={[styles.container, { height }]}>
          <View style={styles.noLocation}>
            <Text style={styles.noLocationTitle}>Harita bilgisi geçerli değil.</Text>
            <Text style={styles.noLocationText}>Harita üzerinde ilanın konumunu belirleyin</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentLat = markerPosition?.lat ?? 39.9334;
  const currentLng = markerPosition?.lng ?? 32.8597;

  const handleMapPress = (e: any) => {
    if (!editable) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ lat: latitude, lng: longitude });
    setShowHint(false); // Konum seçilince hint'i gizle
  };

  const handleSaveLocation = () => {
    if (markerPosition && onLocationChange) {
      onLocationChange(markerPosition.lat, markerPosition.lng);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Harita Container */}
          <View style={styles.mapContainer}>
            <MapView
              style={[styles.map, { height }]}
              initialRegion={{
                latitude: currentLat,
                longitude: currentLng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onMapReady={() => setMapReady(true)}
              onPress={handleMapPress}
              scrollEnabled
              zoomEnabled
              pitchEnabled={false}
              rotateEnabled={false}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {mapReady && markerPosition && (
                <Marker
                  coordinate={{ latitude: markerPosition.lat, longitude: markerPosition.lng }}
                  title="İlan Konumu"
                  draggable={editable}
                  onDragEnd={(e) => {
                    if (!editable) return;
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setMarkerPosition({ lat: latitude, lng: longitude });
                  }}
                />
              )}
            </MapView>

            {/* Harita üzerinde info tooltip */}
            {editable && showHint && (
              <View style={styles.hintOverlay}>
                <View style={styles.hintBubble}>
                  <Ionicons name="information-circle" size={16} color="#25C5D1" />
                  <Text style={styles.hintText}>Haritaya tıklayarak konum seçin</Text>
                  <TouchableOpacity onPress={() => setShowHint(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {editable && markerPosition && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Konumu Kaydet</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyMap;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  mapContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  map: { 
    width: "100%",
  },
  hintOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    alignItems: "flex-start",
  },
  hintBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  hintText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25C5D1",
    paddingVertical: 14,
    gap: 8,
    marginTop: 20,
    borderRadius: 10,
  },
  saveButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  noLocation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
  },
  noLocationTitle: { 
    fontSize: 16, 
    color: "#333", 
    fontWeight: "700",
    marginBottom: 8,
  },
  noLocationText: { 
    fontSize: 14, 
    color: "#999",
    textAlign: "center",
  },
});