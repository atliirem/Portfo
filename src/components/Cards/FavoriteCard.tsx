import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useWishlistToggle } from "../FavoriteToggle";

interface FavoriteCardProps {
  property: {
    id: number;
    title: string;
    cover?: string;
    type?: { title?: string };
    city?: { title?: string };
    district?: { title?: string };
  };
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ property }) => {
  const toggleFavorite = useWishlistToggle(property);

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Image
        source={{
          uri:
            property.cover ||
            "https://via.placeholder.com/150x120.png?text=No+Image",
        }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {property.title || "İlan Başlığı Yok"}
        </Text>

        <Text style={styles.typeText}>
          {property.type?.title || "Tür Belirtilmemiş"}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.locationText}>
            {property.city?.title || "Şehir Yok"}
            {property.district?.title ? ` / ${property.district.title}` : ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
        <Ionicons name="heart" size={22} color="#F44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FavoriteCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 10,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  typeText: {
    fontSize: 13,
    color: "#1a8b95",
    fontWeight: "500",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  heartButton: {
    padding: 8,
  },
});
