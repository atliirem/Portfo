import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  deleteInvitationThunk,
  getInvitationsThunk,
  updateInvitationThunk,
  getRolesThunk,
} from "../../../../api";
import { AppDispatch, RootState } from "../../../redux/store";
import CreateInvitationModal from "../../Modal/CreateInvitationModal";

interface Invitation {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: {
    code: string;
    number: string;
  };
  role: {
    key: string;
    title: string;
  };
  locale: {
    key: string;
    title: string;
  };
  status: "waiting" | "completed" | "expired";
  created_by: string;
  created_at: string;
  expiry_at: string;
}

const InvitationsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    invitations,
    invitationsLoading,
    invitationsError,
    deleteInvitationLoading,
    updateInvitationLoading,
    roles,
    rolesLoading,
  } = useSelector((state: RootState) => state.company);

  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditRoleSelector, setShowEditRoleSelector] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhoneCode, setEditPhoneCode] = useState("90");
  const [editRole, setEditRole] = useState("");
  const [editRoleTitle, setEditRoleTitle] = useState("");
  const [editLocale, setEditLocale] = useState("tr");

  useEffect(() => {
    dispatch(getInvitationsThunk());
    if (roles.length === 0) {
      dispatch(getRolesThunk());
    }
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getInvitationsThunk());
    setRefreshing(false);
  };

  const handleInvitationSuccess = () => {
    dispatch(getInvitationsThunk());
  };

  const handleDelete = (invitation: Invitation) => {
    Alert.alert(
      "Davetiye Sil",
      `"${invitation.name}" adlı davetiyeyi silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteInvitationThunk(invitation.id)).unwrap();
              Alert.alert("Başarılı", "Davetiye silindi.");
            } catch (error: any) {
              Alert.alert("Hata", error || "Davetiye silinemedi.");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setEditName(invitation.name);
    setEditEmail(invitation.email);
    setEditPhone(invitation.phone.number);
    setEditPhoneCode(invitation.phone.code);
    setEditRole(invitation.role.key);
    setEditRoleTitle(invitation.role.title);
    setEditLocale(invitation.locale.key);
    setEditModalVisible(true);
  };

  const handleEditRoleSelect = (roleKey: string, roleTitle: string) => {
    setEditRole(roleKey);
    setEditRoleTitle(roleTitle);
    setShowEditRoleSelector(false);
  };

  const handleUpdateInvitation = async () => {
    if (!selectedInvitation) return;

    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Hata", "İsim ve e-posta zorunludur.");
      return;
    }

    try {
      await dispatch(
        updateInvitationThunk({
          invitationId: selectedInvitation.id,
          data: {
            name: editName.trim(),
            email: editEmail.trim(),
            role: editRole,
            locale: editLocale,
            phone: editPhone,
            phone_code: editPhoneCode,
          },
        })
      ).unwrap();

      Alert.alert("Başarılı", "Davetiye güncellendi.");
      setEditModalVisible(false);
      setSelectedInvitation(null);
      setShowEditRoleSelector(false);
      dispatch(getInvitationsThunk());
    } catch (error: any) {
      Alert.alert("Hata", error || "Davetiye güncellenemedi.");
    }
  };

  const renderItem = ({ item }: { item: Invitation }) => (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Oluşturma Tarihi: </Text>
            <Text style={styles.value}>{item.created_at}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Sona Erme Süresi: </Text>
            <Text style={styles.value}>{item.expiry_at}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rol: </Text>
            <Text style={styles.value}>{item.role.title}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Davetiye Kodu: </Text>
            <Text style={styles.codeValue}>{item.code}</Text>
          </View>
        </View>

        {item.status === "waiting" && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create-outline" size={17} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
              disabled={deleteInvitationLoading}
            >
              <Ionicons name="trash-outline" size={17} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="mail-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Henüz davetiye bulunmuyor.</Text>
      <Text style={styles.emptySubtext}>Yeni ekip üyeleri davet edin</Text>
    </View>
  );

  if (invitationsLoading && invitations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  if (invitationsError) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#ef4444" />
        <Text style={styles.errorText}>{invitationsError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getInvitationsThunk())}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kullanıcı Davetiyeleri</Text>
        </View>

        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#25C5D1"]}
              tintColor="#25C5D1"
            />
          }
        />
      </View>

      <CreateInvitationModal
        isVisible={invitationModalVisible}
        onClose={() => setInvitationModalVisible(false)}
        onSuccess={handleInvitationSuccess}
      />

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (showEditRoleSelector) {
            setShowEditRoleSelector(false);
          } else {
            setEditModalVisible(false);
          }
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            {showEditRoleSelector ? (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    onPress={() => setShowEditRoleSelector(false)}
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Rol Seçin</Text>
                  <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.modalBody}>
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
                          editRole === role.key && styles.roleItemSelected,
                        ]}
                        onPress={() => handleEditRoleSelect(role.key, role.title)}
                      >
                        <Text
                          style={[
                            styles.roleItemText,
                            editRole === role.key && styles.roleItemTextSelected,
                          ]}
                        >
                          {role.title}
                        </Text>
                        {editRole === role.key && (
                          <Ionicons name="checkmark-circle" size={22} color="#25C5D1" />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Davetiye Düzenle</Text>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.inputLabel}>İsim</Text>
                  <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="İsim girin"
                  />

                  <Text style={styles.inputLabel}>E-posta</Text>
                  <TextInput
                    style={styles.input}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="E-posta girin"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabel}>Telefon</Text>
                  <View style={styles.phoneRow}>
                    <TextInput
                      style={[styles.input, styles.phoneCodeInput]}
                      value={editPhoneCode}
                      onChangeText={setEditPhoneCode}
                      placeholder="90"
                      keyboardType="number-pad"
                    />
                    <TextInput
                      style={[styles.input, styles.phoneNumberInput]}
                      value={editPhone}
                      onChangeText={setEditPhone}
                      placeholder="Telefon numarası"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <Text style={styles.inputLabel}>Rol</Text>
                  <TouchableOpacity
                    style={styles.roleInputContainer}
                    onPress={() => setShowEditRoleSelector(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={editRoleTitle ? styles.selectedText : styles.placeholderText}>
                      {editRoleTitle || "Rol seçiniz"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                  </TouchableOpacity>

                  <Text style={styles.inputLabel}>Dil</Text>
                  <TextInput
                    style={styles.input}
                    value={editLocale}
                    onChangeText={setEditLocale}
                    placeholder="Dil kodu (örn: tr)"
                  />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      updateInvitationLoading && styles.saveButtonDisabled,
                    ]}
                    onPress={handleUpdateInvitation}
                    disabled={updateInvitationLoading}
                  >
                    {updateInvitationLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Kaydet</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default InvitationsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    marginTop: -50
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ffff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: -10
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginTop: 12,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#25C5D1",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.6,
    borderColor: '#bbbbbbff',
  },
  cardAccent: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#c3c3c3",
  },
  value: {
    fontSize: 13,
    color: "#6b7280",
  },
  codeValue: {
    fontSize: 13,
    color: "#6b7280",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#dedcdcff",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },
  roleInputContainer: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
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
  },
  phoneCodeInput: {
    width: 70,
  },
  phoneNumberInput: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#25C5D1",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});