import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

interface Personal {
  id: number;
  avatar: string;
  name: string;
  is_active?: boolean;
  roles?: { id: number; title: string; key?: string }[];
  contacts?: {
    phone?: { code: string; number: string | null };
    email?: string;
    whatsapp?: string;
  };
  contacts_can_visible?: boolean;
}

interface TeamSectionProps {
  team: Personal[];
  loading: boolean;
  onToggleStatus?: (personalId: number, currentStatus: boolean) => void;
}

interface PersonalCardProps {
  personal: Personal;
  onToggleStatus?: (personalId: number, currentStatus: boolean) => void;
}

const PersonalCard: React.FC<PersonalCardProps> = ({ personal, onToggleStatus }) => {
  const avatarUrl = personal.avatar?.includes("svg")
    ? personal.avatar.replace("format=svg", "format=png")
    : personal.avatar;

  const handleWhatsApp = () => {
    if (personal.contacts?.whatsapp) {
      Linking.openURL(personal.contacts.whatsapp);
    }
  };

  const handleEmail = () => {
    if (personal.contacts?.email) {
      Linking.openURL(`mailto:${personal.contacts.email}`);
    }
  };

  const handlePhone = () => {
    const phone = personal.contacts?.phone;
    if (phone?.number && phone.number !== "null") {
      Linking.openURL(`tel:+${phone.code}${phone.number.replace(/\D/g, "")}`);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = !personal.is_active;
    const actionText = newStatus ? "aktif" : "pasif";
    
    Alert.alert(
      "Durum Değiştir",
      `${personal.name} adlı personeli ${actionText} yapmak istiyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            if (onToggleStatus) {
              onToggleStatus(personal.id, personal.is_active ?? false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{personal.name}</Text>

        {personal.roles && personal.roles.length > 0 && (
          <Text style={styles.position}>{personal.roles[0].title}</Text>
        )}

        <View style={styles.row}>
          <Ionicons name="call-outline" size={13} color="#000" />
          <Text style={styles.infoText}>
            {" "}|{" "}
            {personal.contacts?.phone?.number &&
            personal.contacts.phone.number !== "null"
              ? `+${personal.contacts.phone.code} ${personal.contacts.phone.number}`
              : "Telefon yok"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={12} color="#000" />
          <Text style={styles.infoText}>
            {" "}| {personal.contacts?.email ?? "Email yok"}
          </Text>
        </View>

        {/* Aktif/Pasif Butonu - Tıklanabilir */}
        {personal.is_active !== undefined && (
          <TouchableOpacity
            style={[
              styles.statusBadge,
              personal.is_active ? styles.activeBadge : styles.inactiveBadge,
            ]}
            onPress={handleToggleStatus}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.statusText,
                personal.is_active ? styles.activeText : styles.inactiveText,
              ]}
            >
              {personal.is_active ? "Aktif" : "Pasif"}
            </Text>
          </TouchableOpacity>
        )}

        {personal.contacts_can_visible && (
          <View style={styles.contactButtons}>
            {personal.contacts?.phone?.number &&
              personal.contacts.phone.number !== "null" && (
                <TouchableOpacity style={styles.contactBtn} onPress={handlePhone}>
                  <Ionicons name="call" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            {personal.contacts?.email && (
              <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
                <Ionicons name="mail" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            {personal.contacts?.whatsapp && (
              <TouchableOpacity
                style={[styles.contactBtn, styles.whatsappBtn]}
                onPress={handleWhatsApp}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const TeamSection: React.FC<TeamSectionProps> = ({ team, loading, onToggleStatus }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );
  }

  if (!team || team.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz personel bilgisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={team}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PersonalCard 
          personal={item} 
          onToggleStatus={onToggleStatus}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default TeamSection;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 40,
    marginBottom: 10,
  },
  info: {
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  position: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    fontSize: 12.5,
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
  },
  activeBadge: {
    backgroundColor: "#d4edda",
  },
  inactiveBadge: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeText: {
    color: "#155724",
  },
  inactiveText: {
    color: "#721c24",
  },
  contactButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#25C5D1",
    justifyContent: "center",
    alignItems: "center",
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
  },
});