import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../../redux/store";
import { getCountries } from "../../../../api";
import { updateProfile } from "../../../../api";

const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  // const { country, loading } = useSelector(
  //   (state: RootState) => state.country
  // );
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
 

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
       setPhone(user.phone.number || "");
  
    }
  }, [user]);

  const handleSave = () => {
    if (!name || !email  || !phone) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return;
    }

  

    console.log("Gönderilen veri:", { name, email, });

    dispatch(updateProfile({ name, email}))
      .unwrap()
      .then(() => {
        Alert.alert("Başarılı", "Profiliniz güncellendi.");
        navigation.goBack();
      })
      .catch((err: any) => {
        Alert.alert("Hata", err || "Güncelleme başarısız.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilinizi Güncelleyin</Text>

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

<View style={{flexDirection: 'row'}}>
       <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
        style={styles.textInputsmall}
      />

       <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
        style={styles.textInput}
      />


    </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, top: "5%" },
  title: { fontSize: 22, fontWeight: "600", color: "black", marginBottom: 16 },
  textInput: {
    borderWidth: 0.5,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  textInputsmall:{
     borderWidth: 0.5,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  pickerContainer: {
    width: "45%",
    borderWidth: 0.5,
    borderRadius: 6,
    marginRight: 10,
  },
  phoneInput: { flex: 1 },
  saveBtn: {
    backgroundColor: "#1a8b95",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
