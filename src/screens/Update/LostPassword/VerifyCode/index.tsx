import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { RootStackParamList } from "../../../../navigation/RootStack";
import TextInputR from "../../../../components/TextInput/TextInputR";
import { ProfileButton } from "../../../../components/Buttons/profileButton";
import Logo from "../../../../components/Logo";
import { forgetPasswordThunk } from "../../../../../api/publicApi";
import { clearForgetPasswordState } from "../../../../redux/Slice/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyCode">;

const VerifyCode: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    forgetPasswordLoading,
    forgetPasswordSuccess,
    forgetPasswordError,
  } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (forgetPasswordSuccess) {
      Alert.alert(
        "Başarılı",
        "Doğrulama kodu e-posta adresinize gönderildi",
        [
          {
            text: "Tamam",
            onPress: () => {
              dispatch(clearForgetPasswordState());
              // Email'i PushNewPassword'a parametre olarak gönder
              navigation.navigate("PushNewPassword", { email, });
            },
          },
        ]
      );
    }
  }, [forgetPasswordSuccess, dispatch, navigation, email]);

  useEffect(() => {
    if (forgetPasswordError) {
      Alert.alert("Hata", forgetPasswordError);
      dispatch(clearForgetPasswordState());
    }
  }, [forgetPasswordError, dispatch]);

  const handleSendMail = () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Uyarı", "Geçerli bir e-posta adresi girin.");
      return;
    }

    dispatch(
      forgetPasswordThunk({
        email,
        locale: "tr",
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Logo />
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <Text style={styles.desc}>
          Şifrenizi sıfırlamak için e-posta adresinizi girin
        </Text>

        <TextInputR
          placeholder="E-posta adresiniz"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ProfileButton
          label={forgetPasswordLoading ? "Gönderiliyor..." : "Kod Gönder"}
          bg="#25C5D1"
          height={44}
          color="white"
          marginTop={16}
          onPress={handleSendMail}
          disabled={forgetPasswordLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    marginTop: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#ffc964",
  },
  desc: {
    textAlign: "center",
    color: "#999",
    marginBottom: 20,
    fontWeight: "600",
  },
});