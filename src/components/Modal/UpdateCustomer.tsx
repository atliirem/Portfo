// components/Modal/UpdateCustomerModal.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateCustomer } from "../../../api";

interface UpdateCustomerModalProps {
  isVisible: boolean;
  onClose: () => void;
  customer: { id: number; name: string; email?: string; phone?: { code?: string; number?: string } } | null;
}

const UpdateCustomerModal: React.FC<UpdateCustomerModalProps> = ({ isVisible, onClose, customer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setName(customer?.name ?? "");
    setEmail(customer?.email ?? "");
    setPhone(customer?.phone?.number ?? "");
  }, [customer]);

  const handleSave = () => {
    if (!customer) return;
    dispatch(updateCustomer({ id: customer.id, body: { name, email, phone } }));
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onSwipeComplete={onClose} swipeDirection="down" style={styles.modal}>
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Müşteri Düzenle</Text>

        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ad Soyad" />

        <Text style={styles.label}>E-posta</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@ornek.com" />

        <Text style={styles.label}>Telefon</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+90 5xx xxx xx xx" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default UpdateCustomerModal;

const styles = StyleSheet.create({
  modal: { justifyContent: "flex-end", margin: 0 },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: "70%" },
  dragIndicator: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  input: { height: 45, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, marginBottom: 12 },
  saveButton: { backgroundColor: "#00A6A6", borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 6 },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
