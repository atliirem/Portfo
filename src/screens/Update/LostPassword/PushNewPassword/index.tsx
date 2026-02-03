import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList } from "../../../../navigation/RootStack";
import { AppDispatch, RootState } from "../../../../redux/store";
import { forgetPushNewPasswordThunk, forgetPasswordThunk } from "../../../../../api/publicApi";
import { clearForgetPushState, clearForgetPasswordState } from "../../../../redux/Slice/authSlice";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import { ProfileButton } from "../../../../components/Buttons/profileButton";
import PasswordTextInput from "../../../../components/TextInput/TextInputPassword";
import Logo from "../../../../components/Logo";

type Props = NativeStackScreenProps<RootStackParamList, "PushNewPassword">;

const CELL_COUNT = 6;

const PushNewPassword: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    forgetPushLoading,
    forgetPushError,
    forgetPushSuccess,
    forgetPasswordLoading,
  } = useSelector((state: RootState) => state.auth);

  // Email parametresini route'dan al (eğer varsa)
  const emailParam = route.params?.email;
  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");
  const [email, setEmail] = useState(emailParam || "");

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [propsCode, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (forgetPushSuccess) {
      Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi", [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(clearForgetPushState());
            navigation.replace("Login");
          },
        },
      ]);
    }
  }, [forgetPushSuccess, dispatch, navigation]);

  useEffect(() => {
    if (forgetPushError) {
      Alert.alert("Hata", forgetPushError, [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(clearForgetPushState());
          },
        },
      ]);
    }
  }, [forgetPushError, dispatch]);

  const handleResendCode = () => {
    if (!email) {
      Alert.alert(
        "Email Gerekli", 
        "Kod tekrar göndermek için email adresinizi girin",
        [
          {
            text: "Geri Dön",
            onPress: () => navigation.goBack(),
          },
        ]
      );
      return;
    }

    Alert.alert(
      "Kod Yeniden Gönder",
      "Yeni doğrulama kodu göndermek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Gönder",
          onPress: () => {
            dispatch(forgetPasswordThunk({ email, locale: "tr" }))
              .unwrap()
              .then(() => {
                Alert.alert("Başarılı", "Yeni kod e-posta adresinize gönderildi");
                setCode(""); // Kod alanını temizle
              })
              .catch((err) => {
                Alert.alert("Hata", err || "Kod gönderilemedi");
              });
          },
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (code.length !== CELL_COUNT) {
      Alert.alert("Uyarı", "6 haneli doğrulama kodunu girin");
      return;
    }

    if (!password || !againPassword) {
      Alert.alert("Uyarı", "Tüm alanları doldurun");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Uyarı", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== againPassword) {
      Alert.alert("Uyarı", "Şifreler eşleşmiyor");
      return;
    }

    dispatch(
      forgetPushNewPasswordThunk({
        token: code,
        new_password: password,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <Text style={styles.title}>Şifre Yenile</Text>
      <Text style={styles.desc}>
        E-posta adresinize gelen 6 haneli kodu girin ve yeni şifrenizi belirleyin
      </Text>

      <View style={styles.codeHeader}>
        <Text style={styles.codeTitle}>Doğrulama Kodu</Text>
        <TouchableOpacity 
          onPress={handleResendCode}
          disabled={forgetPasswordLoading}
        >
          <Text style={styles.resendText}>
            {forgetPasswordLoading ? "Gönderiliyor..." : "Kod Gönder"}
          </Text>
        </TouchableOpacity>
      </View>

      <CodeField
        ref={ref}
        {...propsCode}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused && <Cursor />)}
          </Text>
        )}
      />

      <PasswordTextInput
        placeholder="Yeni şifre (min. 6 karakter)"
        value={password}
        onChangeText={setPassword}
      />

      <PasswordTextInput
        placeholder="Yeni şifre tekrar"
        value={againPassword}
        onChangeText={setAgainPassword}
      />

      <ProfileButton
        label={forgetPushLoading ? "Gönderiliyor..." : "Kaydet"}
        height={44}
        marginTop={12}
        bg="#25C5D1"
        color="#fff"
        onPress={handleSubmit}
        disabled={forgetPushLoading}
      />

      {forgetPushLoading && (
        <ActivityIndicator style={{ marginTop: 12 }} color="#25C5D1" />
      )}
    </SafeAreaView>
  );
};

export default PushNewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  logo: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffc964",
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    textAlign: "center",
    color: "#999",
    marginBottom: 24,
    fontWeight: "600",
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  codeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#25C5D1",
  },
  resendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#25C5D1",
    textDecorationLine: "underline",
  },
  codeFieldRoot: {
    marginBottom: 24,
    justifyContent: "space-between",
  },
  cell: {
    width: 42,
    height: 48,
    lineHeight: 46,
    fontSize: 22,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    color: "#222",
  },
  focusCell: {
    borderColor: "#25C5D1",
  },
});