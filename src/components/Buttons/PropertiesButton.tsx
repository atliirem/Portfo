import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useWishlistToggle } from "../FavoriteToggle";
import CreateOfferModal from "../../screens/CreatePriceOffer";
import SelectCustomerModal from "../../screens/SelectCustomerModal";
import { addProperty, getCustomer } from "../../utils/offeresStorage"

const PropertiesButton = ({ item }: { item: any }) => {
  const toggleFavorite = useWishlistToggle(item);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const checkCustomer = async () => {
        const customer = await getCustomer();
        setSelectedCustomer(customer);
      };
      checkCustomer();
    }, [])
  );

  const handleAddToList = async () => {
    const added = await addProperty({
      id: item.id,
      title: item.title,
      cover: item.cover || item.images?.[0]?.url,
      price: item.prices?.primary?.formatted,
      priceNumber: item.prices?.primary?.number,
    });

    if (added) {
      Alert.alert("Başarılı", "İlan listeye eklendi");
    } else {
      Alert.alert("Uyarı", "Bu ilan zaten listede");
    }
  };

  const handleCustomerModalClose = async () => {
    setShowCustomerModal(false);
    const customer = await getCustomer();
    setSelectedCustomer(customer);
  };

  return (
    <View>
      {/* Geri */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-outline" size={25} color="#1a8b95" />
      </TouchableOpacity>

      {/* Favori */}
      <TouchableOpacity
        style={styles.iconContainerheart}
        onPress={toggleFavorite}
      >
        <Ionicons name="heart-outline" size={25} color="#1a8b95" />
      </TouchableOpacity>

      {/* Fiyat Teklifi */}
      <TouchableOpacity
        style={styles.iconContainerPrice}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.textPrice}>Fiyat Teklifi Oluştur</Text>
      </TouchableOpacity>

      <CreateOfferModal
        visible={showModal}
        propertyId={item.id}
        onClose={() => setShowModal(false)}
      />

      {/* Müşteri seçiliyse: Listeye Ekle, değilse: Müşteri Seç */}
      {selectedCustomer ? (
        <TouchableOpacity
          style={styles.iconContainerAdd}
          onPress={handleAddToList}
        >
          <Ionicons name="add-circle-outline" size={25} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconContainerFolder}
          onPress={() => setShowCustomerModal(true)}
        >
          <Ionicons name="folder-outline" size={25} color="#1a8b95" />
        </TouchableOpacity>
      )}

      {/* Müşteri Seçim Modalı */}
      <SelectCustomerModal
        visible={showCustomerModal}
        onClose={handleCustomerModalClose}
      />
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
  iconContainerAdd: {
    position: "absolute",
    top: 12,
    left: 350,
    backgroundColor: "#25C5D1",
    padding: 8,
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
  },
  textPrice: {
    color: "#1a8b95",
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
  },
});