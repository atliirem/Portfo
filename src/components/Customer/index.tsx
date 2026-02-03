import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { RootState, AppDispatch } from "../../redux/store";
import { getCustomers } from "../../../api";

import CustomerCard from "../Cards/CustomerCard";
import AddNewCustomerModal from "../Modal/AddNewCustomerModal";
import UpdateCustomerModal from "../Modal/UpdateCustomer";

import { styles } from "./style";

const CustomerScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    dispatch(getCustomers() as any);
  }, [dispatch]);

  const refreshCustomers = useCallback(() => {
    dispatch(getCustomers() as any);
  }, [dispatch]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers ?? [];
    return (customers ?? []).filter((item) =>
      (item.name ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleEdit = useCallback((customer: any) => {
    setSelectedCustomer(customer);
    setShowUpdateModal(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: any) => (
      <CustomerCard
        customer={{
          id: item.id,
          name: item.name,
          email: item.contacts?.email ?? item.email,
          phone: item.contacts?.phone ?? item.phone,
          creator: item.creator,
          created_at: item.created_at,
          proposals: item.proposals ?? 0,
        }}
        onEdit={handleEdit}
      />
    ),
    [handleEdit]
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
        <Text style={styles.errorText}>{String(error)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#999" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Müşteri adı ile ara..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>


        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
        />


        <View style={styles.bottomArea}>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={styles.fixedButton}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Yeni Müşteri Oluştur</Text>
          </TouchableOpacity>
        </View>


        <AddNewCustomerModal
          isVisible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshCustomers}
        />

        <UpdateCustomerModal
          isVisible={showUpdateModal}
          customer={selectedCustomer}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedCustomer(null);
          }}
          onSuccess={refreshCustomers}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomerScreen;