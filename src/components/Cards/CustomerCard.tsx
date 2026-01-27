import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppDispatch } from "../../redux/store";
import { deleteCustomer } from "../../../api";
import { RootStackParamList } from "../../navigation/RootStack"; // yolu düzelt

interface CustomerCardProps {
  customer: {
    id: number;
    notes?: string;
    name: string;
    email?: string;
    phone?: { code: string; number: string };
    created_at: string;
    creator: string;
    proposals: number;
  };
  onEdit: (customer: any) => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList, "CustomerOffersDetail">;

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<Nav>();

  const handleDelete = () => {
    Alert.alert("Müşteriyi Sil", `"${customer.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteCustomer(customer.id)).unwrap();
            console.log("Silindi:", customer.id);
          } catch (err) {
            console.log("Silme hatası:", err);
          }
        },
      },
    ]);
  };

  const goToCustomerOffers = () => {
    navigation.navigate("CustomerOffersDetail", {
      customer_id: String(customer.id),
      customer_name: customer.name,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.info}>
          <Text style={styles.name}>{customer.name}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Telefon:</Text>
            <Text style={styles.value}>
              {customer.phone ? `+${customer.phone.code} ${customer.phone.number}` : "Bilgi yok"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>E-posta:</Text>
            <Text style={styles.value}>{customer.email ?? "Bilgi yok"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Oluşturma:</Text>
            <Text style={styles.value}>{customer.created_at}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Oluşturan:</Text>
            <Text style={styles.value}>{customer.creator}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.rowButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => onEdit(customer)}>
              <Ionicons name="create-outline" size={18} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.trashButton} onPress={handleDelete}>
              <Ionicons name="trash" size={15} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={goToCustomerOffers} style={styles.offerButton}>
            <Text style={styles.label}>{customer.proposals} teklif</Text>
            <Ionicons name="chevron-forward-outline" size={12} color="#9d9d9d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    color: "#c2c2c2",
    marginRight: 6,
  },
  value: {
    fontSize: 11,
    fontWeight: "500",
    color: "#b9bbc1",
    flexShrink: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  rowButtons: { flexDirection: "row", marginBottom: 6 },
  editButton: {
    width: 27,
    height: 27,
    borderRadius: 4,
    backgroundColor: "#eaebec",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  trashButton: {
    width: 27,
    height: 27,
    borderRadius: 4,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
  },
  offerButton: {
    width: 90,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#eaebec",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
});
