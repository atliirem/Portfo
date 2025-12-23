import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface PersonalCardProps {
  personal: {
    id: number;
    avatar: string;
    name: string;
    roles?: { id: number; title: string; key?: string }[];
    email?: string;
    city?: string | null;
    company?: string | null;
    contact?: {
      phone?: { code: string; number: string };
      email?: string;
      whatsapp?: string;
    };
  };
}

const PersonalCard: React.FC<PersonalCardProps> = ({ personal }) => {
  const avatarUrl =
    personal.avatar?.includes("svg")
      ? personal.avatar.replace("format=svg", "format=png")
      : personal.avatar;

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      <View style={styles.info}>
      
        <Text style={styles.name}>{personal.name}</Text>

     

        
        <View style={styles.row}>
          <Ionicons name="call-outline" size={13} color="#000" />
          <Text style={styles.infoText}>
            {" "}
            |{" "}
            {personal.contact?.phone?.number
              ? `+${personal.contact.phone.code} ${personal.contact.phone.number}`
              : "Telefon yok"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={12} color="#000" />
          <Text style={styles.infoText}>
            {" "}
            | {personal.email ?? "Email yok"}
          </Text>
        </View>

     
        {personal.company && (
          <Text style={styles.company}>{personal.company}</Text>
        )}

        {personal.city && <Text style={styles.city}>{personal.city}</Text>}
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
});
