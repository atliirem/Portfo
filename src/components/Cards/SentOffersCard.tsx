import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { ProfileButton } from "../Buttons/profileButton";
import Ionicons from "@react-native-vector-icons/ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const DEFAULT_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";


type SentOffersCardProps = {
  item: {
    id: number | string;
    title?: string;
    code?: string;
    created_at: string;
    status: { key: string; title: string };
 
    offered_price?: {
      formatted?: string;
    };
    property?: {
      cover?: string;
      title?: string;
      primary?: { formatted?: string };
      secondary?: { formatted?: string };
      code?: string;
    };
  };
  onPress?: () => void;
};

const SentOffersCard: React.FC<SentOffersCardProps> = ({ item, onPress }) => {
  
  


  const property = item.property;
     const navigation = useNavigation<NavigationProp>();


  const getStatusColor = (key?: string) => {
    switch (key?.toLowerCase()) {
      case "confirm": return "#4CAF50"; 
      case "reject": return "#E53935"; 
      case "waiting":
      case "beklemede": return "#25C5D1"; 
      default: return "#9E9E9E"; 
    }
  };


  const titleDisplay = item.title || property?.title || `Teklif Kodu: ${item.code || "-"}`;


  const imageSource = property?.cover ? { uri: property.cover } : { uri: DEFAULT_IMAGE };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={()=> navigation.navigate('SentOffersDetail', {id: item.id})}
    >
      <View style={styles.inner}>

        <Image
          style={styles.image}
          source={imageSource}
          resizeMode="cover"
        />


        <View style={styles.contentContainer}>
          

          <Text numberOfLines={2} style={styles.title}>
            {titleDisplay}
          </Text>


          <View style={styles.badgeWrapper}>
            <ProfileButton
              label={item.status?.title || "Durum Yok"}
              marginTop={0}
              bg={getStatusColor(item.status?.key)}
              width={90}
              color="white"
              height={22}
            />
          </View>


          <View style={styles.row}>
            <Text style={styles.label}>Teklif Edilen Fiyat:</Text>
            <Text style={styles.valueText}>
              {item.offered_price?.formatted ?? property?.primary?.formatted ?? "-"}
            </Text>
          </View>

     
          <View style={styles.row}>
            <Text style={styles.label}>Pass Fiyatı:</Text>
            <Text style={styles.valueText}>
              {property?.secondary?.formatted ?? "-"}
            </Text>
          </View>

        </View>

     
        <View style={styles.rightContainer}>
         
            <Ionicons name="chevron-forward-outline" size={24} color={'#c4c4c4'}/>
        </View>
      </View>
      

      <View style={styles.footer}>
        <Text style={styles.dateText}>Oluşturma Tarihi: {item.created_at}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SentOffersCard;

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
    textTransform: 'uppercase',
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5
  },
  footer: {
    paddingRight: 12,
    paddingBottom: 10,
    alignItems: 'flex-end',
  
  },
  dateText: {
    fontSize: 10,
    color: "#AFAFAF",
    fontWeight: "500",
  }
});