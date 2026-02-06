import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";

type CompaniesCardProps = {
  id: number;
  title: string;
  image: string;
  city?: string;
  type?: string;
  onPress?: () => void; 
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CompaniesCard: React.FC<CompaniesCardProps> = ({
  id,
  title,
  image,
  city,
  type,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate("CompaniesScreen", { id });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.inner}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          {type && <Text style={styles.company}>{type}</Text>}
          {city && <Text style={styles.city}>{city}</Text>}
        </View>

        {/* <Ionicons
          name="chevron-forward-outline"
          size={24}
          color="#c4c4c4"
        /> */}
      </View>
    </TouchableOpacity>
  );
};

export default CompaniesCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 6,
    elevation: 3,
    borderColor: "#e5e5e5",
    borderWidth: 1,

  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  company: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  city: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
});
