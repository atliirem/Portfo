import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import PasswordTextInput from "../../../components/TextInput/TextInputPassword";
import { ProfileButton } from "../../../components/Buttons/profileButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { changePasswordThunk, verifyPasswordCodeThunk } from "../../../../api";
import { clearPasswordChangeState } from "../../../redux/Slice/authSlice";


type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

const ChangePassword: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    passwordChangeLoading,
    passwordChangeError,
    passwordChangeSuccess,
    verifyCodeLoading,
    verifyCodeError,
    verifyCodeSuccess,
  } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [againNewPassword, setAgainNewPassword] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (passwordChangeSuccess) {
      setShowVerifyModal(true);
    }
  }, [passwordChangeSuccess]);


  useEffect(() => {
    if (verifyCodeSuccess) {
      Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi.", [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(clearPasswordChangeState());
            setShowVerifyModal(false);
            setOldPassword("");
            setNewPassword("");
            setAgainNewPassword("");
            setVerificationCode("");
            navigation.goBack();
          },
        },
      ]);
    }
  }, [verifyCodeSuccess]);

  // Doğrulama hatası
  useEffect(() => {
    if (verifyCodeError) {
      Alert.alert("Hata", verifyCodeError);
    }
  }, [verifyCodeError]);

  useEffect(() => {
    if (passwordChangeError) {
      Alert.alert("Hata", passwordChangeError, [
        {
          text: "Tamam",
          onPress: () => dispatch(clearPasswordChangeState()),
        },
      ]);
    }
  }, [passwordChangeError]);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordChangeState());
    };
  }, []);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !againNewPassword) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword !== againNewPassword) {
      Alert.alert("Uyarı", "Yeni şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Uyarı", "Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    dispatch(
      changePasswordThunk({
        current: oldPassword,
        password: newPassword,
        password_confirm: againNewPassword,
      })
    );
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length < 4) {
      Alert.alert("Uyarı", "Lütfen doğrulama kodunu girin.");
      return;
    }

    dispatch(
      verifyPasswordCodeThunk({
        code: verificationCode,
      })
    );
  };

  const handleCloseModal = () => {
    setShowVerifyModal(false);
    setVerificationCode("");
    dispatch(clearPasswordChangeState());
  };

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

          <ProfileButton
            label={passwordChangeLoading ? "Gönderiliyor..." : "Güncelle"}
            bg="#25C5D1"
            height={40}
            color="white"
            marginTop={10}
            onPress={handleChangePassword}
            disabled={passwordChangeLoading}
          />
        </View>
      </ScrollView>


      <Modal
        visible={showVerifyModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Doğrulama Kodu</Text>
            <Text style={styles.modalMessage}>
              E-posta adresinize gönderilen doğrulama kodunu girin.
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="Doğrulama Kodu"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
                disabled={verifyCodeLoading}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleVerifyCode}
                disabled={verifyCodeLoading}
              >
                {verifyCodeLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Doğrula</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -35,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  codeInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#25C5D1",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
