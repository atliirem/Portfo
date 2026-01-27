import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { updateProfile } from "../../../../api";
import TextInputR from "../../../components/TextInput/TextInputR";

const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhoneCode(user.phone?.code || "");
      setPhoneNumber(user.phone?.number || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!name.trim() || !phoneCode.trim() || !phoneNumber.trim()) {
      Alert.alert("Hata", "Tüm alanları doldurun");
      return;
    }

    dispatch(
      updateProfile({
        name: name.trim(),
        phone_code: phoneCode.replace(/\D/g, ""),
        phone: phoneNumber.replace(/\D/g, ""),
        locale: "tr",
      })
    )
      .unwrap()
      .then(() => {
        Alert.alert("Başarılı", "Profil güncellendi");
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert("Hata", err || "Profil güncellenemedi");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Güncelle</Text>

      <TextInputR
        label="İsim ve Soyisim"
        value={name}
        onChangeText={setName}
        placeholder="Ad Soyad"
      />
      <TextInputR
      disabled
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      
      />

      <View style={styles.phoneRow}>
        <TextInputR
          label="Kod"
          value={phoneCode}
          onChangeText={setPhoneCode}
          placeholder="90"
          keyboardType="number-pad"
          containerStyle={styles.codeInput}
        />

        <TextInputR
          label="Telefon"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Telefon"
          keyboardType="phone-pad"
          containerStyle={styles.phoneInput}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Kaydediliyor..." : "Güncelle"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 20,
    color: "#19A7B6",
  },
  phoneRow: {
    flexDirection: "row",
    gap: 12,
  },
  codeInput: {
    width: 90,
  },
  phoneInput: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#19A7B6",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
 
});
