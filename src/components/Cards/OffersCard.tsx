import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ProfileButton } from "../Buttons/profileButton";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";




type NavigationProp = NativeStackNavigationProp<any, "ProposalsDetail">;

type OffersCardProps = {
  id: number;
  code: string;
  title: string;
  created_at: string;
  property_count: number;
  status: {
    key: string;
    title: string;
  };
  company: {
    personal: string;
  };
  onPress?: () => void;
};

const OffersCard: React.FC<OffersCardProps> = ({
  title,
  id, code,
  created_at,
  status,
  company,
  property_count,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

 

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={()=> navigation.navigate('DetailScreen'
    ,  { code , id }
    )}>
      <View style={styles.inner}>
        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          {company?.personal && (
            <View style={styles.row}>
              <Text style={styles.companyPerson}>{company.personal}</Text>
            </View>
          )}

          {created_at && (
            <View style={styles.row}>
              <Text style={styles.dateLabel}>Oluşturulma Tarihi:</Text>
              <Text style={styles.dateText}>{created_at}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <ProfileButton
              label="★★★★★"
              marginTop={0}
              bg="#f6f7f8"
              width={75}
              color="#c4c4c4"
              height={28}
            />

            {status && (
              <ProfileButton
                label={status.title}
                marginTop={0}
                bg="#25C5D1"
                width={100}
                color="white"
                height={28}
              />
            )}

            <View style={styles.rightAction}>
              <ProfileButton
                label={`${property_count} İlan`}
                marginTop={0}
                bg="#f6f7f8"
                width={80}
                color="#c1c1c1"
                height={28}
              />

              <Ionicons
                name="chevron-forward-outline"
                size={26}
                color="#c4c4c4"
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
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
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    marginLeft: 5,
  },
  companyPerson: {
    fontSize: 15,
    color: "#000",
    fontWeight: "800",
    marginLeft: 6,
  },
  dateLabel: {
    color: "#c4c4c4",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  dateText: {
    color: "#c3c3c3",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center", 
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rightAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileLikeButton: {
    margin: 5,
    borderRadius: 4.2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5
  },
});
