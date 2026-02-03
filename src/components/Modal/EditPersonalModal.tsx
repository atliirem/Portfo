import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { updatePersonalProfileThunk, getRolesThunk } from "../../../api";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  personal: {
    id: number;
    name: string;
    email?: string;
    contact?: {
      phone?: { code: string; number: string | null };
      email?: string;
      whatsapp?: string;
    };
    roles?: { id: number; title: string; key?: string }[];
    role?: string;
  } | null;
}

const EditPersonalModal: React.FC<Props> = ({
  isVisible,
  personal,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, roles, rolesLoading } = useSelector(
    (state: RootState) => state.company
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("90");
  const [selectedRole, setSelectedRole] = useState("");
  const [showRolePicker, setShowRolePicker] = useState(false);

  // Roller yükle
  useEffect(() => {
    if (isVisible && roles.length === 0) {
      console.log("📥 Roller yükleniyor...");
      dispatch(getRolesThunk());
    }
  }, [isVisible, dispatch, roles.length]);

  useEffect(() => {
    if (!personal) return;

    console.log("🔍 EditPersonalModal - Gelen personal:", personal);

    setName(personal.name ?? "");
    setEmail(personal.contact?.email ?? personal.email ?? "");
    
    if (personal.contact?.phone) {
      setPhoneCode(personal.contact.phone.code ?? "90");
      setPhoneNumber(personal.contact.phone.number ?? "");
    }

    // Role - roles array'inden veya direkt role field'dan
    if (personal.roles && personal.roles.length > 0 && personal.roles[0].key) {
      setSelectedRole(personal.roles[0].key);
      console.log("📋 Mevcut rol (roles array):", personal.roles[0]);
    } else if (personal.role) {
      setSelectedRole(personal.role);
      console.log("📋 Mevcut rol (role field):", personal.role);
    }

    console.log("📋 Modal state:", {
      name: personal.name,
      email: personal.contact?.email ?? personal.email,
      phone: personal.contact?.phone,
      selectedRole: personal.roles?.[0]?.key ?? personal.role,
    });
  }, [personal]);

  const handleSave = async () => {
    if (!personal) return;

    if (!name.trim()) {
      Alert.alert("Hata", "İsim boş olamaz");
      return;
    }

    try {
      const updateData: {
        name: string;
        phone?: string;
        phone_code?: string;
        role?: string;
        locale?: string;
      } = {
        name: name.trim(),
        locale: "tr",
      };

      if (phoneNumber.trim()) {
        updateData.phone = phoneNumber.trim();
        updateData.phone_code = phoneCode;
      }

      if (selectedRole) {
        updateData.role = selectedRole;
      }

      console.log("📤 Gönderilen veri:", updateData);

      await dispatch(
        updatePersonalProfileThunk({
          personalId: personal.id,
          data: updateData,
        })
      ).unwrap();

      Alert.alert("Başarılı", "Personel güncellendi");
      onClose();
    } catch (err: any) {
      console.error("❌ Güncelleme hatası:", err);
      Alert.alert("Hata", err || "Güncelleme başarısız");
    }
  };

  const getRoleTitle = () => {
    if (!selectedRole) return "Rol Seçin";
    const role = roles.find(r => r.key === selectedRole);
    return role?.title || "Rol Seçin";
  };

  if (!personal) return null;

  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        
        <Text style={styles.title}>Düzenle</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Ad Soyad */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>İsim ve Soyisim</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* E-posta */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>E-posta</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              keyboardType="email-address"
              placeholderTextColor="#999"
              autoCapitalize="none"
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          {/* Telefon */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Telefon</Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={styles.phoneCodeInput}
                value={`+${phoneCode}`}
                onChangeText={(text) => setPhoneCode(text.replace('+', ''))}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.phoneSeparator} />
              <TextInput
                style={styles.phoneNumberInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="(5xx) xxx xx xx"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Rol Seçici */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Rol</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowRolePicker(!showRolePicker)}
              disabled={rolesLoading}
            >
              {rolesLoading ? (
                <ActivityIndicator size="small" color="#999" />
              ) : (
                <>
                  <Text style={styles.pickerText}>{getRoleTitle()}</Text>
                  <Ionicons 
                    name={showRolePicker ? "chevron-up" : "chevron-forward"} 
                    size={20} 
                    color="#999" 
                  />
                </>
              )}
            </TouchableOpacity>
            
            {showRolePicker && roles.length > 0 && (
              <View style={styles.pickerOptions}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.key}
                    style={styles.pickerOption}
                    onPress={() => {
                      setSelectedRole(role.key);
                      setShowRolePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      selectedRole === role.key && styles.pickerOptionTextActive
                    ]}>
                      {role.title}
                    </Text>
                    {selectedRole === role.key && (
                      <Ionicons name="checkmark" size={20} color="#25C5D1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Düzenle Butonu */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Düzenle</Text>
            )}
          </TouchableOpacity>

          {/* İptal Butonu */}
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.cancelButton}
            disabled={loading}
          >
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EditPersonalModal;

const styles = StyleSheet.create({
  modal: { 
    justifyContent: "flex-end", 
    margin: 0 
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "600", 
    marginBottom: 24,
    textAlign: "center",
    color: "#25C5D1",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    height: 50,
  },
  phoneCodeInput: {
    fontSize: 15,
    color: "#000",
    width: 50,
  },
  phoneSeparator: {
    width: 1,
    height: 24,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 12,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 15,
    color: "#000",
  },
  pickerOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerOptionText: {
    fontSize: 15,
    color: "#000",
  },
  pickerOptionTextActive: {
    color: "#25C5D1",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#25C5D1",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
  cancelButton: { 
    marginTop: 12, 
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 20,
  },
  cancelText: { 
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});