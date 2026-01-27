import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { ProfileButton } from "../Buttons/profileButton";
import Ionicons from "@react-native-vector-icons/ionicons";

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
  priceLabel = "Teklif Edilen Fiyat:",
  secondaryLabel = "Pass Fiyatı:",
  id,
}) => {
  if (!property) return null;

  const getStatusColor = (key?: string) => {
    switch (key?.toLowerCase()) {
      case "confirm":
        return "#4CAF50";
      case "reject":
        return "#E53935";
      case "waiting":
      case "beklemede":
        return "#25C5D1";
      default:
        return "#9E9E9E";
    }
  };

  const titleDisplay =
    property.title || (id ? `Teklif #${id}` : "Başlıksız İlan");

  const imageSource = property.cover
    ? { uri: property.cover }
    : { uri: DEFAULT_IMAGE };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.inner}>
        <Image style={styles.image} source={imageSource} resizeMode="cover" />

        <View style={styles.contentContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {titleDisplay}
          </Text>

          {status && (
            <View style={styles.badgeWrapper}>
              <ProfileButton
                label={status.title || "Durum Yok"}
                marginTop={0}
                bg={getStatusColor(status.key)}
                width={90}
                color="white"
                height={22}
              />
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>{priceLabel}</Text>
            <Text style={styles.valueText}>
              {offered_price?.formatted ?? property.primary?.formatted ?? "-"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{secondaryLabel}</Text>
            <Text style={styles.valueText}>
              {property.secondary?.formatted ?? "-"}
            </Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={"#c4c4c4"}
          />
        </View>
      </View>

      {!!created_at && (
        <View style={styles.footer}>
          <Text style={styles.dateText}>Oluşturma Tarihi: {created_at}</Text>
        </View>
      )}
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
    borderColor: "#EAEAEA",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  badgeWrapper: {
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: -8,
  },
  row: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: "#8F8F8F",
    fontWeight: "500",
    marginBottom: 1,
  },
  valueText: {
    color: "#F9C43E",
    fontWeight: "900",
    fontSize: 18,
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
  },
  footer: {
    paddingRight: 12,
    paddingBottom: 10,
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 10,
    color: "#AFAFAF",
    fontWeight: "500",
  },
});
