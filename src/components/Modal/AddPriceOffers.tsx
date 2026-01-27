import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardEvent,
} from "react-native";
import Modal from "react-native-modal";

interface AddNewCustomerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddPriceOffers: React.FC<AddNewCustomerModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Keyboard event listener'ları
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSave = () => {
    console.log("Yeni fiyat teklifi:", { name, email });
    Keyboard.dismiss();
    onClose();
    setName("");
    setEmail("");
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
      avoidKeyboard={false} // ✨ False yapıyoruz, kendi kontrol edeceğiz
      useNativeDriver={false}
    >
      <View
        style={[
          styles.sheet,
          keyboardHeight > 0 && {
            marginBottom: Platform.OS === "ios" ? keyboardHeight : 0,
          },
        ]}
      >
        <View style={styles.dragIndicator} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <Text style={styles.title}>Yeni Fiyat Teklifi Oluştur</Text>

          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Müşteri adını giriniz"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta adresini giriniz"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddPriceOffers;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%", // ✨ Biraz daha yükselttik
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#00A6A6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});