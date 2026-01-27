import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, AppDispatch } from "../../redux/store";
import { sendContactFormThunk } from "../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputR from "../TextInput/TextInputR";

const ContactForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      if (user.phone) {
        setPhone(`${user.phone.code || ""} ${user.phone.number || ""}`.trim());
      }
    }
  }, [user]);

  const handleSend = async () => {
    if (!name.trim()) {
      Alert.alert("Uyarı", "Lütfen adınızı girin.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Uyarı", "Lütfen e-posta adresinizi girin.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Uyarı", "Lütfen telefon numaranızı girin.");
      return;
    }
    if (!subject.trim()) {
      Alert.alert("Uyarı", "Lütfen konu girin.");
      return;
    }
    if (!message.trim()) {
      Alert.alert("Uyarı", "Lütfen mesajınızı girin.");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        sendContactFormThunk({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
          locale: "tr",
        })
      ).unwrap();

      Alert.alert(
        "Başarılı",
        "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
        [
          {
            text: "Tamam",
            onPress: () => {
              setSubject("");
              setMessage("");
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Hata", error || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInputR
            label="Ad Soyad"
            value={name}
            onChangeText={setName}
            placeholder="Adınız ve soyadınız"
          />

          <TextInputR
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInputR
            label="Telefon"
            value={phone}
            onChangeText={setPhone}
            placeholder="0 5XX XXX XX XX"
            keyboardType="phone-pad"
          />

          <TextInputR
            label="Konu"
            value={subject}
            onChangeText={setSubject}
            placeholder="Mesajınızın konusu"
          />

          <View style={styles.messageContainer}>
            <Text style={styles.label}>Mesaj</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Mesajınızı buraya yazın..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={styles.messageInput}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendText}>Gönder</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  messageContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
    minHeight: 120,
  },
  sendBtn: {
    backgroundColor: "#1a8b95",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#93C5C9",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});