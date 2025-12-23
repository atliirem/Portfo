import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import CustomTextInput from "../../../components/TextInput/TextInputPassword";
import TextInput from "../../../components/TextInput/TextInputUser";
import TextInputUser from "../../../components/TextInput/TextInputUser";
import PasswordTextInput from "../../../components/TextInput/TextInputPassword";
import { ProfileButton } from "../../../components/Buttons/profileButton";
type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

const ChangePassword: React.FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [againNewPassword, setAgainNewPassword] = useState("");


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Şifre Değiştir</Text>

          <PasswordTextInput
            placeholder="Eski şifrenizi girin"
            value={oldPassword}
            onChangeText={setOldPassword}
          />

    
           <PasswordTextInput
            placeholder="Yeni şifrenizi girin"
            value={newPassword}
            onChangeText={setNewPassword}
          />


           <PasswordTextInput
            placeholder="Tekrar yeni şifrenizi girin"
            value={againNewPassword}
            onChangeText={setAgainNewPassword}
          />

          <ProfileButton label="Güncelle" bg="#25C5D1"  height={40} color="white" marginTop={10} />
          
        </View>


        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -35
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: -4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 12,
    
  },
});