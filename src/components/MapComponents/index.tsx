import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";



interface MapData {
  latitude: string;
  longitude: string;
}


interface PropertyMapProps {
  location: MapData | null | undefined; 
}

const PropertyMap = ({ location }: PropertyMapProps) => {
  

  if (!location || !location.latitude || !location.longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text>Konum verisi bulunamadı.</Text>
      </View>
    );
  }


  const lat = parseFloat(location.latitude);
  const lng = parseFloat(location.longitude);

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
      >
        <Marker
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          title="İlan Konumu"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350, 
    width: "300%",
    borderRadius: 12,
    overflow: "hidden", 
    marginTop: 10,
    backgroundColor: '#eee' 
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginTop: 10,
  },
});

export default PropertyMap;