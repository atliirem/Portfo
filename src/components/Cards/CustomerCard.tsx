import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { deleteCustomer } from "../../../api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";

interface CustomerCardProps {
  customer: {
    id: number;
    name: string;
    email?: string;
    phone?: {
      code: string;
      number: string;
    };
    created_at: string;
    creator: string;
    proposals: number;
  };
  onEdit: (customer: any) => void;
}

type Nav = NativeStackNavigationProp<RootStackParamList, "CustomerOffersDetail">;


const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<Nav>();

  const handleDelete = () => {
    Alert.alert("Müşteriyi Sil", `"${customer.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          await dispatch(deleteCustomer(customer.id) as any);
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
  <Text style={styles.textInfo} >Telefon Numarası : </Text>
          <Text style={styles.value}>
            {customer.phone
              ? `+${customer.phone.code} ${customer.phone.number}`
              : "Telefon yok"}
          </Text>
          </View>

                <View style={styles.row} >
              <Text style={styles.textInfo}>E-posta : </Text>
          <Text style={styles.value}>
            {customer.email ?? "E-posta yok"}
          </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.rowButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(customer)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trashButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={15} color="#fff" />
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  value: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b3b2b2ff",
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#eaebec",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,

   
  },
  trashButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
  },

   offerButton: {
    width: 75,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#eaebec",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
    label: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#c2c2c2",
    marginRight: 6,
  },
   rowButtons: { flexDirection: "row", marginBottom: 6, justifyContent: 'space-evenly', marginLeft: 2 },
   textInfo: {
    fontWeight: '800',
    fontSize: 11.8,
    color: "#b3b2b2ff"


   },
   row:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  
   }
});
1