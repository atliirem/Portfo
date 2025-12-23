import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useWishlistToggle } from "../FavoriteToggle";
import AddPriceOffers from "../Modal/AddPriceOffers";

const PropertiesButton = ({ item }: { item: any }) => {
  const toggleFavorite = useWishlistToggle(item);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false); 

  return (
    <View>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={25} color="#1a8b95" />
      </TouchableOpacity>

     
      <TouchableOpacity style={styles.iconContainerheart} onPress={toggleFavorite}>
        <Ionicons name="heart-outline" size={25} color="#1a8b95" />
      </TouchableOpacity>


      <TouchableOpacity  onPress={() => setShowModal(true)}
      style={styles.iconContainerPrice}>
        <Text style={styles.textPrice}>Fiyat Teklifi Oluştur</Text>
      </TouchableOpacity>


<AddPriceOffers
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        />

      <TouchableOpacity
        style={styles.iconContainerFolder}
        onPress={() => navigation.navigate("Favorite" as never)}
      >
        <Ionicons name="folder-outline" size={25} color="#1a8b95" />
      </TouchableOpacity>
    </View>
  );
};

export default PropertiesButton;

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    top: 12,
    left: 20,
    backgroundColor: "rgba(175, 175, 175, 0.4)",
    padding: 8,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
  },
  iconContainerheart: {
    position: "absolute",
    top: 12,
    left: 190,
    backgroundColor: "rgba(175, 175, 175, 0.4)",
    padding: 8,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
  },
  iconContainerPrice: {
    position: "absolute",
    top: 12,
    left: 240,
    backgroundColor: "rgba(175, 175, 175, 0.4)",
    padding: 8,
    borderRadius: 10,
    width: 100,
    height: 48,
  },
  iconContainerFolder: {
    position: "absolute",
    top: 12,
    left: 350,
    backgroundColor: "rgba(175, 175, 175, 0.4)",
    padding: 8,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
  },
  textPrice: {
    color: "#1a8b95",
    fontWeight: "800",
    fontSize: 13,
    justifyContent: "center",
    textAlign: "center",
  },
});
