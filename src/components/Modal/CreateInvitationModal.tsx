import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@react-native-vector-icons/ionicons";

import { AppDispatch, RootState } from "../../redux/store";
import { createInvitationThunk, getRolesThunk } from "../../../api";
import { clearInvitationError } from "../../redux/Slice/companySlice";

interface CreateInvitationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { createInvitationLoading, createInvitationError, roles, rolesLoading } = useSelector(
    (state: RootState) => state.company
  );

  console.log("Roles state:", roles, "Loading:", rolesLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("90");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleTitle, setSelectedRoleTitle] = useState("");
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    console.log("Modal açıldı, roles:", roles.length);
    if (isVisible && roles.length === 0) {
      console.log("Roller çekiliyor...");
      dispatch(getRolesThunk());
    }
  }, [isVisible, dispatch, roles.length]);

  const handleRoleSelect = (roleKey: string, roleTitle: string) => {
    setSelectedRole(roleKey);
    setSelectedRoleTitle(roleTitle);
    setShowRoleSelector(false);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPhoneCode("90");
    setSelectedRole("");
    setSelectedRoleTitle("");
    setShowRoleSelector(false);
    dispatch(clearInvitationError());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Hata", "Ad Soyad alanı zorunludur.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Hata", "E-posta alanı zorunludur.");
      return;
    }

    if (!selectedRole) {
      Alert.alert("Hata", "Lütfen bir rol seçin.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      phone_code: phoneCode.trim() || undefined,
      role: selectedRole,
      locale: "tr",
    };

    try {
      await dispatch(createInvitationThunk(payload)).unwrap();
      Alert.alert("Başarılı", "Davetiye başarıyla oluşturuldu.", [
        {
          text: "Tamam",
          onPress: () => {
            handleClose();
            onSuccess?.();
          },
        },
      ]);
    } catch (err) {
      console.log("Create invitation error:", err);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        if (showRoleSelector) {
          setShowRoleSelector(false);
        } else {
          handleClose();
        }
      }}
      onSwipeComplete={() => {
        if (showRoleSelector) {
          setShowRoleSelector(false);
        } else {
          handleClose();
        }
      }}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
      backdropOpacity={0.5}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        
        {showRoleSelector ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => setShowRoleSelector(false)} 
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Rol Seçin</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {rolesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#25C5D1" />
                  <Text style={styles.loadingText}>Roller yükleniyor...</Text>
                </View>
              ) : (
                roles.map((role) => (
                  <TouchableOpacity
                    key={role.key}
                    style={[
                      styles.roleItem,
                      selectedRole === role.key && styles.roleItemSelected,
                    ]}
                    onPress={() => handleRoleSelect(role.key, role.title)}
                  >
                    <Text
                      style={[
                        styles.roleItemText,
                        selectedRole === role.key && styles.roleItemTextSelected,
                      ]}
                    >
                      {role.title}
                    </Text>
                    {selectedRole === role.key && (
                      <Ionicons name="checkmark-circle" size={22} color="#25C5D1" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Yeni Ekip Üyesi Davet Et</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ekip üyesinin adını giriniz"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>E-posta *</Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresi"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Rol *</Text>
              <TouchableOpacity
                style={styles.roleInputContainer}
                onPress={() => setShowRoleSelector(true)}
                activeOpacity={0.7}
              >
                <Text style={selectedRoleTitle ? styles.selectedText : styles.placeholderText}>
                  {selectedRoleTitle || "Rol seçiniz"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>

              <Text style={styles.label}>Telefon (Opsiyonel)</Text>
              <View style={styles.phoneRow}>
                <View style={styles.phoneCodeWrapper}>
                  <Text style={styles.phoneCodePrefix}>+</Text>
                  <TextInput
                    style={styles.phoneCodeInput}
                    placeholder="90"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phoneCode}
                    onChangeText={setPhoneCode}
                    maxLength={4}
                  />
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="5551234567"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {createInvitationError && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#dc3545" />
                  <Text style={styles.errorText}>{createInvitationError}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  createInvitationLoading && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={createInvitationLoading}
              >
                {createInvitationLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Davetiye Gönder</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.infoText}>
                Davetiye e-posta adresine gönderilecektir. Kullanıcı daveti kabul ettikten sonra ekibinize katılacaktır.
              </Text>
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

export default CreateInvitationModal;

const styles = StyleSheet.create({
  modal: { 
    justifyContent: "flex-end", 
    margin: 0 
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  roleInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedText: {
    fontSize: 15,
    color: "#333",
  },
  placeholderText: {
    fontSize: 15,
    color: "#999",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  roleItemSelected: {
    backgroundColor: "#f0f9fa",
  },
  roleItemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  roleItemTextSelected: {
    color: "#25C5D1",
    fontWeight: "600",
  },
  phoneRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  phoneCodeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    width: 80,
  },
  phoneCodePrefix: {
    fontSize: 15,
    color: "#666",
  },
  phoneCodeInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingLeft: 4,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { 
    color: "#dc3545", 
    fontSize: 14,
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#25C5D1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  saveButtonDisabled: { 
    opacity: 0.7 
  },
  saveButtonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  },
  infoText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
});