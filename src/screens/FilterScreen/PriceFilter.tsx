import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import TextInputNormal from "../../components/TextInput/TextInputNormal";

const screenHeight = Dimensions.get("window").height;
type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const PriceFilterModal = ({ isVisible, onClose }: Props) => {


  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Fiyat</Text>

        <TextInputNormal
          placeholder="Minimum Fiyat"
          value={minPrice}
          onChangeText={setMinPrice}
        />

        <TextInputNormal
          placeholder="Maksimum Fiyat"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.clearButton} onPress={onClose}>
            <Text style={styles.clearText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PriceFilterModal;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: screenHeight * 0.35,
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 10,
  },
  buttons: {
    marginTop: 30,
  },
  clearButton: {
    backgroundColor: "#b6b4b4d4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "700" },
});
