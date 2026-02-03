import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../redux/store";
import { createCustomerThunk } from "../../../api";

interface AddNewCustomerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddNewCustomerModal: React.FC<AddNewCustomerModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { createCustomerLoading, createCustomerError } = useSelector(
    (state: RootState) => state.company
  );

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneCode, setPhoneCode] = React.useState("90");

  const handleSave = async () => {
    const payload = {
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      phone_code: phoneCode.trim() || undefined,
      locale: "tr",
    };

    if (!payload.name) return;

    try {
      await dispatch(createCustomerThunk(payload)).unwrap();

      setName("");
      setEmail("");
      setPhone("");
      setPhoneCode("90");
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("Create customer error:", err);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Yeni Müşteri Ekle</Text>

        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput
          style={styles.input}
          placeholder="Müşteri adını giriniz"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          placeholder="E-posta adresi"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Ülke Kodu</Text>
        <TextInput
          style={styles.input}
          placeholder="90"
          keyboardType="phone-pad"
          value={phoneCode}
          onChangeText={setPhoneCode}
        />

        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          placeholder="5551234567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {createCustomerError ? (
          <Text style={styles.errorText}>{createCustomerError}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.saveButton,
            createCustomerLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={createCustomerLoading}
        >
          {createCustomerLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddNewCustomerModal;

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "75%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  errorText: { color: "red", marginBottom: 10 },
  saveButton: {
    backgroundColor: "#00A6A6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});