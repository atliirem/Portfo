import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import { ProfileButton } from "../Buttons/profileButton";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type OfferDetailCardProps = {
  data: {
    id: number;
    created_at: string;
    notes?: string;

    property: {
      id: number;
      title: string;
      cover?: string;
      type?: { title: string };
      country?: { title?: string };
      city?: { title?: string };
      street?: { title?: string };
    };

    status: {
      key: string;
      title: string;
    };

    offered_price?: {
      formatted: string;
    };

    prices?: {
      primary?: { formatted: string };
      secondary?: { formatted: string };
    };

    company?: {
      id: number;
      personal?: string;
      name?: string;
      logo?: string;
      type?: string;
    };
  };
};

const DEFAULT_IMAGE =
  "https://via.placeholder.com/300x200?text=No+Image";

const OfferDetailCard: React.FC<OfferDetailCardProps> = ({ data }) => {
  const navigation = useNavigation<NavigationProp>();

  const {
    property,
    status,
    offered_price,
    prices,
    created_at,
    company,
    notes,
  } = data;

  const getStatusColor = (key?: string) => {
    switch (key) {
      case "confirm":
        return "#4CAF50";
      case "reject":
        return "#E53935";
      case "waiting":
        return "#25C5D1";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <View style={styles.card}>

      {company && (
        <TouchableOpacity
          style={styles.companyHeader}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("CompanyDetailScreen", {
              id: company.id,
            })
          }
        >
          <Image
            source={{ uri: company.logo || DEFAULT_IMAGE }}
            style={styles.companyLogo}
          />

          <View style={styles.companyInfo}>
            {company.personal && (
              <Text style={styles.companyPersonal}>
                {company.personal}
              </Text>
            )}
            {company.name && (
              <Text style={styles.companyName}>{company.name}</Text>
            )}
            {company.type && (
              <Text style={styles.companyType}>{company.type}</Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward-outline"
            size={22}
            color="#C4C4C4"
          />
        </TouchableOpacity>
      )}


      <View style={styles.content}>
        <Text style={styles.createdText}>
          {created_at} tarihinde {company?.personal} tarafından
          oluşturuldu
        </Text>

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {property.title}
          </Text>

          <Text style={styles.typeText}>
            / {property?.type?.title ?? "-"}
          </Text>

          <ProfileButton
            label={status.title}
            bg={getStatusColor(status.key)}
            width={110}
            height={24}
            color="white"
          />
        </View>

        <Image
          source={{ uri: property.cover || DEFAULT_IMAGE }}
          style={styles.image}
        />

        <Text style={styles.location}>
          {property?.street?.title}, {property?.city?.title},{" "}
          {property?.country?.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Satış:</Text>
          <Text style={styles.pricePrimary}>
            {prices?.primary?.formatted ?? "-"}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Pass Fiyatı:</Text>
          <Text style={styles.priceSecondary}>
            {prices?.secondary?.formatted ?? "-"}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.label}>Teklif:</Text>
          <Text style={styles.pricePrimary}>
            {offered_price?.formatted ?? "-"}
          </Text>
        </View>

        {notes && (
          <View style={styles.priceRow}>
            <Text style={styles.label}>Not:</Text>
            <Text style={styles.note}>{notes}</Text>
          </View>
        )}

        <ProfileButton
          label="İlana git"
          color="white"
          marginTop={20}
          height={38}
          width={340}
          bg="#c4c4c4"
          onPress={() =>
            navigation.navigate("PropertiesDetailScreen", {
              id: property.id,
            })
          }
        />
      </View>
    </View>
  );
};

export default OfferDetailCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    overflow: "hidden",
  },

  /* COMPANY HEADER */
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  companyLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEE",
  },

  companyInfo: {
    flex: 1,
    marginLeft: 12,
  },

  companyPersonal: {
    fontSize: 12,
    color: "#B6B7BD",
    fontWeight: "600",
  },

  companyName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },

  companyType: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },

  /* CONTENT */
  content: {
    padding: 12,
  },

  createdText: {
    fontSize: 13,
    color: "#C4C4C4",
    marginBottom: 6,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  typeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C4C4C4",
  },

  image: {
    width: "100%",
    height: 280,
    borderRadius: 8,
    marginTop: 10,
  },

  location: {
    fontSize: 11,
    color: "#B9B9B9",
    textAlign: "right",
    marginTop: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  label: {
    fontSize: 13,
    color: "#B5B6BC",
    fontWeight: "600",
    marginRight: 6,
  },

  pricePrimary: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F9C43E",
  },

  priceSecondary: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F9C43E",
  },

  note: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
});
