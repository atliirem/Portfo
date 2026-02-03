import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";

interface PersonalCardProps {
  personal: {
    id: number;
    avatar?: string;
    image?: string;
    name: string;
    roles?: { id: number; title: string; key?: string }[];
    email?: string;
    city?: string | null;
    company?: string | null;
    contact?: {
      phone?: { code: string; number: string | null };
      email?: string;
      whatsapp?: string;
    };
    is_active?: boolean;
  };
  onEdit?: () => void;
  onToggleStatus?: () => void;
  statusLoading?: boolean;
}

const PersonalCard: React.FC<PersonalCardProps> = ({
  personal,
  onEdit,
  onToggleStatus,
  statusLoading,
}) => {
  const avatarUrl = personal.avatar || personal.image;
  const finalAvatarUrl = avatarUrl?.includes("svg")
    ? avatarUrl.replace("format=svg", "format=png")
    : avatarUrl;

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRolesText = () => {
    if (!personal.roles || personal.roles.length === 0) return "";
    return personal.roles.map((r) => r.title).join(" ");
  };

  const formatPhone = () => {
    if (!personal.contact?.phone?.number) return null;
    const code = personal.contact.phone.code || "90";
    const number = personal.contact.phone.number;

    const formatted = number.replace(
      /(\d{3})(\d{3})(\d{2})(\d{2})/,
      "($1) $2 $3 $4"
    );
    return `+${code} ${formatted}`;
  };

  const handlePhonePress = () => {
    if (personal.contact?.phone?.number) {
      const phoneNumber = `+${personal.contact.phone.code || "90"}${personal.contact.phone.number}`;
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmailPress = () => {
    const email = personal.contact?.email || personal.email;
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleWhatsAppPress = () => {
    const whatsappNumber =
      personal.contact?.whatsapp || personal.contact?.phone?.number;
    if (whatsappNumber) {
      const code = personal.contact?.phone?.code || "90";
      Linking.openURL(`https://wa.me/${code}${whatsappNumber}`);
    }
  };

  const isGeneralManager = personal.roles?.some(
    (role) => role.key === "chairmen" 
  );

  const phoneNumber = formatPhone();
  const rolesText = getRolesText();
  const displayEmail = personal.contact?.email || personal.email;

  return (
    <View style={styles.card}>
      {finalAvatarUrl ? (
        <Image source={{ uri: finalAvatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{getInitials(personal.name)}</Text>
        </View>
      )}

      <Text style={styles.name}>{personal.name}</Text>
      {rolesText ? <Text style={styles.roles}>{rolesText}</Text> : null}

      <View style={styles.contactContainer}>
        <TouchableOpacity
          style={styles.contactRow}
          onPress={handlePhonePress}
          disabled={!personal.contact?.phone?.number}
        >
          <Ionicons name="call-outline" size={16} color="#333" />
          <Text style={styles.separator}>|</Text>
          <Text style={styles.contactText}>
            {phoneNumber || "Telefon yok"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactRow}
          onPress={handleEmailPress}
          disabled={!displayEmail}
        >
          <Ionicons name="mail-outline" size={16} color="#333" />
          <Text style={styles.separator}>|</Text>
          <Text style={styles.contactText}>{displayEmail || "Email yok"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactRow}
          onPress={handleWhatsAppPress}
        >
          <Ionicons name="logo-whatsapp" size={16} color="#333" />
          <Text style={styles.separator}>|</Text>
          <Text style={styles.contactText}>Whatsapp'dan mesaj gönder</Text>
        </TouchableOpacity>
      </View>

      {personal.company && (
        <Text style={styles.company}>{personal.company}</Text>
      )}
      {personal.city && <Text style={styles.city}>{personal.city}</Text>}

      <View style={styles.actionContainer}>

        {!isGeneralManager && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color="#666" />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.statusButton,
            personal.is_active === false && styles.statusButtonActive,
            isGeneralManager && styles.statusButtonFullWidth,
          ]}
          onPress={onToggleStatus}
          disabled={statusLoading}
        >
          {statusLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name={
                  personal.is_active === false
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                size={18}
                color="#fff"
              />
              <Text style={styles.statusButtonText}>
                {personal.is_active === false
                  ? "Hesabı Aktif Et"
                  : "Hesabı Pasife Al"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#25C5D1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  roles: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  contactContainer: {
    width: "100%",
    marginTop: 16,
    gap: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  separator: {
    fontSize: 14,
    color: "#ccc",
  },
  contactText: {
    fontSize: 14,
    color: "#333",
  },
  company: {
    fontSize: 12,
    color: "#555",
    marginTop: 10,
  },
  city: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actionContainer: {
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    paddingVertical: 5,
    gap: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC3545",
    borderRadius: 4,
    paddingVertical: 5,
    gap: 8,
  },
  statusButtonActive: {
    backgroundColor: "#22c55e",
  },
  statusButtonFullWidth: {

  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});