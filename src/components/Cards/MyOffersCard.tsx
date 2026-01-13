import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { ProfileButton } from "../Buttons/profileButton";

const DEFAULT_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

export type MyOffersCardProps = {
  id?: number | string;
  priceLabel?: string; 
  secondaryLabel?: string;
  
  property?: {
    cover?: string;
    title?: string;
    primary?: { formatted?: string };
    secondary?: { formatted?: string };
    code?: string;
  };
  created_at?: string;
  status?: {
    key: string;
    title: string;
  };
  offered_price?: {
    formatted?: string;
  };
  onPress?: () => void;
};

const MyOffersCard: React.FC<MyOffersCardProps> = ({
  created_at,
  property,
  status,
  offered_price,
  onPress,
  priceLabel = "Teklif Edilen:", 
  secondaryLabel = "Pass Fiyat:",
}) => {
  
  if (!property) return null;


  const getStatusColor = (key?: string) => {
    switch (key) {
      case "confirm": return "#4CAF50";
      case "reject": return "#E53935";
      default: return "#25C5D1"; 
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <Image
          style={styles.image}
          source={{ uri: property.cover || DEFAULT_IMAGE }}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>

          <View style={styles.headerRow}>
            <Text numberOfLines={1} style={styles.title}>
              {property.title || "Başlıksız İlan"}
            </Text>

            {status && (
              <View style={styles.badgeContainer}>
                 <ProfileButton
                  label={status.title}
                  marginTop={0}
                  bg={getStatusColor(status.key)}
                  width={98}
                  color="white"
                  height={23}
                />
              </View>
            )}
          </View>


          <View style={styles.infoRow}>
            <Text style={styles.label}>{priceLabel}</Text>
            <Text style={styles.primaryValue}>
              {offered_price?.formatted ?? property.primary?.formatted ?? "-"}
            </Text>
          </View>


          <View style={styles.infoRow}>
            <Text style={styles.label}>{secondaryLabel}</Text>
            <Text style={styles.secondaryValue}>
              {property.secondary?.formatted ?? "-"}
            </Text>
          </View>


          {created_at && (
            <Text style={styles.createdAt}>
              Oluşturulma Tarihi: {created_at}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyOffersCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    width: "95%",
    alignSelf: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    height: 160,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inner: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  headerRow: {
    marginBottom: 6,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginLeft: -8
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap' 
  },
  label: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
    marginRight: 4,
  },
  primaryValue: {
    color: "#F9C43E", 
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryValue: {
    color: "#F9C43E",
    fontWeight: "800",
    fontSize: 14,
  },
  createdAt: {
    fontSize: 10,
    color: "#999",
    marginTop: 6,
    fontStyle: 'italic'
  },
});