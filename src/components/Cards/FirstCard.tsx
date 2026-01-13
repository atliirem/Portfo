import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type FirstCardProps = {
  title: string;
  image?: string;
  price?: string;
  prices?: {
    primary?: { formatted: string };
    secondary?: { formatted: string };
  };
  status?: string;
  updated_at?: string;
  creator?: string;
  company?: {
    title: string;
    logo: string;
  };
  type?: string;
  city?: string;
  district?: string;
  onPress?: () => void;
};

const FALLBACK_IMAGE =
  "https://portfoy.demo.pigasoft.com/default-property-image.jpg";

const FirstCard: React.FC<FirstCardProps> = ({
  title,
  image,
  price,
  prices,
  company,
  type,
  city,
  district,
  status,
  updated_at,
  creator,
  onPress,
}) => {
  /** 🔒 IMAGE GUARD (EN KRİTİK KISIM) */
  const imageUri =
    image && typeof image === "string" && image.startsWith("http")
      ? image
      : FALLBACK_IMAGE;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <Image
          key={imageUri} 
          source={{ uri: `${imageUri}?v=${Date.now()}` }} 
          style={styles.image}
          resizeMode="cover"
          onError={() =>
            console.log("❌ IMAGE LOAD ERROR:", imageUri)
          }
        />

        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

   
          {type && (
            <View style={styles.row}>
              <Ionicons name="menu" size={11} color="#a6a6a6" />
              <Text style={styles.company}> {type}</Text>
            </View>
          )}


          {(city || district) && (
            <View style={styles.row}>
              <Ionicons name="location" size={11} color="#a6a6a6" />
              <Text style={styles.company}>
                {city} {city && district ? "/" : ""} {district}
              </Text>
            </View>
          )}

      
          {(updated_at || status) && (
            <View style={styles.row}>
              {updated_at && (
                <Text style={styles.company}>{updated_at}</Text>
              )}
              {status && (
                <Text style={styles.company}> • {status}</Text>
              )}
            </View>
          )}


          {(company?.title || creator) && (
            <View style={styles.row}>
              <Ionicons name="person" size={11} color="#a6a6a6" />
              <Text style={styles.company}>
                {company?.title || creator}
              </Text>
            </View>
          )}

     
          {(price || prices?.primary?.formatted) && (
            <Text style={styles.price}>
              {price || prices?.primary?.formatted}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FirstCard;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    width: 350,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 3,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f2f2f2", // boşken gri alan
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  price: {
    color: "#F9C43E",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  company: {
    fontSize: 9.5,
    color: "#a6a6a6",
    marginLeft: 4,
  },
});
