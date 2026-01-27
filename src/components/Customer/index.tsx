import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { getCustomers } from "../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerCard from "../Cards/CustomerCard";
import { SearchBar } from "react-native-elements";
import AddNewCustomerModal from "../Modal/AddNewCustomerModal";

const BUTTON_HEIGHT = 56;

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

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers ?? [];
    return (customers ?? []).filter((item) =>
      (item.name ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const renderItem = useCallback(({ item }: any) => {
    return (
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
        onEdit={() => {}}
      />
    );
  }, []);

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
        <SearchBar
          placeholder="Müşteri adı ile ara..."
          onChangeText={setSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={styles.searchText}
        />

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
            onPress={() => setShowModal(true)}
            style={styles.fixedButton}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Yeni Müşteri Oluştur</Text>
          </TouchableOpacity>
        </View>

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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    height: 40,
  },
  searchText: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  bottomArea: {
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  fixedButton: {
    height: BUTTON_HEIGHT,
    backgroundColor: "#2EC4D6",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 46,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});