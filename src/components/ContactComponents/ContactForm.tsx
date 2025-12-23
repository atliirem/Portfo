import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../redux/store";
// import { updateContact } from "../../redux/slices/contactSlice"; // isteğe bağlı

const ContactForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

    // ✅ İstersen burada API'ye gönderebilirsin veya Redux dispatch
    // dispatch(updateContact({ name, email }));

    console.log("Gönderilen veri:", { name, email });

    Alert.alert("Başarılı", "Bilgiler güncellendi");
    // navigation.goBack(); // geri gitmek istersen
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ad Soyad"
        style={styles.textInput}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
        style={styles.textInput}
      />

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Güncelle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactForm;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, top: "5%" },
  title: { fontSize: 22, fontWeight: "600", color: "black", marginBottom: 16 },
  textInput: {
    borderWidth: 0.5,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#1a8b95",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});