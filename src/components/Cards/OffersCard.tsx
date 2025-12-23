import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ProfileButton } from "../Buttons/profileButton";

type OffersCardProps = {
  id: number;
  title: string;
  created_at: string;

  status: {
    key: string;
    title: string;
  };

  company: {
    personal: string;
  };

  onPress: () => void;
};

const OffersCard: React.FC<OffersCardProps> = ({
  id,
  title,
  created_at,
  status,
  company,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <View style={styles.textContainer}>

          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          {company?.personal && (
            <View style={styles.row}>
              <Ionicons name="person-outline" size={16} color="#777" />
              <Text style={styles.companyPerson}>{company.personal}</Text>
            </View>
          )}

          {created_at && (
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={16} color="#777" />
              <Text style={styles.dateLabel}>Oluşturulma Tarihi:</Text>
              <Text style={styles.dateText}>{created_at}</Text>
            </View>
          )}

          {status && (
            <View style={[styles.row, { marginTop: 6 }]}>
              <ProfileButton
                label={status.title}
                marginTop={0}
                bg="#25C5D1"
                width={100}
                color="white"
                height={28}
              />
              <Ionicons
                name="chevron-forward-outline"
                size={30}
                color="#c4c4c4"
                style={{ marginLeft: 10 }}
              />
            </View>
          )}

        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OffersCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    padding: 10,
  },
  inner: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  companyPerson: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    marginLeft: 6,
  },
  dateLabel: {
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  dateText: {
    color: "#444",
    fontSize: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
});
