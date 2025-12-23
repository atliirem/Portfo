import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity
} from "react-native";
import {  useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/Navbar/ProfileStack";
import { SafeAreaView } from "react-native-safe-area-context";
type CompaniesCardProps = {
  id: number;
  title: string;
  image: string;
  city?: string;
 
  type?: string;
  onPress?: () => void;
};

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
const CompaniesCard: React.FC<CompaniesCardProps> = ({
  title,
  image,
  city,

  type,
  onPress
}) => {
     const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView edges={['bottom']}>
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>


          {type && <Text style={styles.campany}>{type}</Text>}


          <View style={{ flexDirection: "row", alignItems: "center", marginTop: -25 }}>
            {/* <Ionicons name="location-outline" color="#a6a6a6" size={15} />

           {city && <Text style={styles.campany}>{city}</Text>} */}
          
          
          </View>
          <View style={{right: -225, top: -4}}>
          <Ionicons onPress={()=>navigation.navigate('CompaniesScreen' as never)}
          name="chevron-forward-outline" size={25} color={'#c4c4c4'}/></View>
        </View>
      </View>
    </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CompaniesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 8,
    marginVertical: 2,
    elevation: 3,
    width: 350,
    alignSelf: "center",
    height: 80,
    borderColor: "#e5e5e5",
    borderWidth: 1,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 18,
    marginTop: 0
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },
  campany: {
    fontSize: 13,
    color: "#a6a6a6",
    marginTop: 3,
  }
});