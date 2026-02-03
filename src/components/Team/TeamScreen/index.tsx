import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getTeam, updatePersonalStatusThunk } from "../../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import PersonalCard from "../../Cards/TeamCard";
import { ProfileButton } from "../../Buttons/profileButton";
import CreateInvitationModal from "../../Modal/CreateInvitationModal";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import EditPersonalModal from "../../Modal/EditPersonalModal";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TeamScreen: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<any | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const { personals, loading, error } = useSelector((state: RootState) => state.company);

  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getTeam());
  }, [dispatch]);

  const handleInvitationSuccess = () => {
    dispatch(getTeam());
  };

  const handleToggleStatus = (personalId: number, currentStatus: boolean | undefined) => {
    const actionText = currentStatus ? "pasif" : "aktif";

    Alert.alert(
      "Durum Değiştir",
      `Bu personeli ${actionText} yapmak istiyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            setTogglingId(personalId);
            try {
              await dispatch(updatePersonalStatusThunk(personalId)).unwrap();
              Alert.alert("Başarılı", `Personel ${actionText} yapıldı`);
              dispatch(getTeam());
            } catch (err: any) {
              Alert.alert("Hata", err || "Durum güncellenemedi");
            } finally {
              setTogglingId(null);
            }
          },
        },
      ]
    );
  };

  // ✅ DÜZELTME: PersonalCard'a gönderilen formattaki objeyi kullan
  const handleEditPersonal = (personal: any) => {
    console.log("🔍 handleEditPersonal - Gönderilen personal:", personal);
    setSelectedPersonal(personal);
    setEditModalVisible(true);
  };

  if (loading && !togglingId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    // ✅ DÜZELTME: Formatlı objeyi değişkene al
    const formattedPersonal = {
      id: item.id,
      image: item.image,
      avatar: item.avatar,
      name: item.name,
      roles: item.roles,
      email: item.contacts?.email,
      city: item.city?.title,
      company: item.company?.title,
      contact: item.contacts,  // ← item.contacts → contact olarak gönderiliyor
      is_active: item.is_active,
    };

    return (
      <PersonalCard
        personal={formattedPersonal}
        onEdit={() => handleEditPersonal(formattedPersonal)}  // ← DÜZELTME: formattedPersonal gönder!
        onToggleStatus={() => handleToggleStatus(item.id, item.is_active)}
        statusLoading={togglingId === item.id}
      />
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Henüz personel bilgisi bulunamadı.</Text>
      <Text style={styles.emptySubtext}>Ekibinize yeni üyeler davet edin</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProfileButton
          label="Kullanıcı Davetiyeleri"
          bg="#c5c5c5"
          height={40}
          marginTop={5}
          color="#fff"
          onPress={() => navigation.navigate('InvitationsScreen')}
        />

        <FlatList
          data={personals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />

        <View style={{ top: -14 }}>
          <ProfileButton
            label="Davetiye Oluştur"
            bg="#25C5D1"
            height={40}
            marginTop={20}
            color="#fff"
            onPress={() => setInvitationModalVisible(true)}
          />
        </View>

        <CreateInvitationModal
          isVisible={invitationModalVisible}
          onClose={() => setInvitationModalVisible(false)}
          onSuccess={handleInvitationSuccess}
        />

        <EditPersonalModal
          isVisible={editModalVisible}
          personal={selectedPersonal}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedPersonal(null);
            dispatch(getTeam()); // ← Modal kapandığında listeyi yenile
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default TeamScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 13,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -60,
  },
  listContainer: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
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
    color: "red",
  },
});