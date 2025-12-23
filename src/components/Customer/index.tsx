import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { deleteCustomer, getCustomers } from "../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerCard from "../Cards/CustomerCard";
import { SearchBar } from "react-native-elements";
import AddNewCustomerModal from "../Modal/AddNewCustomerModal";

const CustomerScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    dispatch(getCustomers() as any);
    
  }, [dispatch]);

  const filteredCustomers = customers?.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <CustomerCard
      customer={{
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        creator: item.creator,
        created_at: item.created_at,
        proposals: item.proposals,
      }} onEdit={function (customer: any): void {
        throw new Error("Function not implemented.");
      } }    />
  );

  if (loading) {
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

  if (!customers || customers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz müşteri bilgisi bulunamadı.</Text>
      </View>
    );
  }

  

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Müşteri adı ile ara..."
          onChangeText={setSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={{ fontSize: 14 , }}
        />

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.fixedButton}
        >
          <Text style={styles.buttonText}>+ Yeni Müşteri Oluştur</Text>
        </TouchableOpacity>

        
        <AddNewCustomerModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    height: 40,
    marginTop: -20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  fixedButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#00A7C0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
