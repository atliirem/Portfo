import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";

import {
  saveCustomer,
  saveCurrency,
  getCustomer,
  getCurrency,
} from "../../utils/offeresStorage"
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getCurrencies, getCustomers } from "../../../api";
import { setCommission, setPass, setPrice } from "../../redux/Slice/formSlice";
import { setSelectedCurrency as setSelectedCurrencyRedux } from "../../redux/Slice/currenciesSlice";
import TextInputUser from "../../components/TextInput/TextInputUser";
import { ProfileButton } from "../../components/Buttons/profileButton";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SelectCustomerModal: React.FC<Props> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<{
    id: number;
    title: string;
    code?: string;
  } | null>(null);

  const {
    data: currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useAppSelector((state) => state.currencies);

  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = useAppSelector((state) => state.company);

  useEffect(() => {
    if (visible) {
      dispatch(getCurrencies());
      dispatch(getCustomers());
      loadSavedData();
    }
  }, [visible]);

  const loadSavedData = async () => {
    const customer = await getCustomer();
    const currency = await getCurrency();
    if (customer) setSelectedCustomer(customer);
    if (currency) setSelectedCurrency(currency);
  };

  const handleCurrencySelect = async (item: any) => {
    const currencyData = {
      id: item.id,
      title: item.title,
      code: item.code || "TRY",
    };
    setSelectedCurrency(currencyData);
    await saveCurrency(currencyData);

    dispatch(setPrice({ currency: item.title, currencyId: item.id }));
    dispatch(setCommission({ currency: item.title, currencyId: item.id }));
    dispatch(setPass({ currency: item.title, currencyId: item.id }));
    dispatch(setSelectedCurrencyRedux(item.id));
    setCurrencyModalVisible(false);
  };

  const handleCustomerSelect = async (customer: { id: number; name: string }) => {
    setSelectedCustomer(customer);
    await saveCustomer(customer);
    setCustomerModalVisible(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      style={styles.bottomModal}
      propagateSwipe
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Müşteri Seçin</Text>

        <TouchableOpacity onPress={() => setCustomerModalVisible(true)}>
          <TextInputUser
            isModal
            placeholder="Müşteri seç"
            value={selectedCustomer?.name || ""}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrencyModalVisible(true)}
          style={{ marginTop: 12 }}
        >
          <TextInputUser
            isModal
            placeholder="Para birimi seç"
            value={selectedCurrency?.title || ""}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <ProfileButton
          height={40}
          label="Uygula"
          marginTop={10}
          bg="#27c4d2"
          color="#fff"
          onPress={handleClose}
        />

        <ProfileButton
          height={40}
          label="Kapat"
          marginTop={0}
          bg="#c4c4c4"
          color="#fff"
          onPress={handleClose}
        />

        {/* Müşteri Modal */}
        <Modal
          isVisible={customerModalVisible}
          onBackdropPress={() => setCustomerModalVisible(false)}
          style={styles.innerModal}
        >
          <View style={styles.innerModalContainer}>
            <Text style={styles.innerModalTitle}>Müşteri Seç</Text>

            {customersLoading && <ActivityIndicator color="#25C5D1" />}
            {customersError && (
              <Text style={styles.errorText}>{customersError}</Text>
            )}

            {!customersLoading && !customersError && customers.length === 0 && (
              <Text style={styles.emptyText}>Müşteri bulunamadı</Text>
            )}

            {!customersLoading && !customersError && customers.length > 0 && (
              <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      selectedCustomer?.id === item.id && styles.listItemSelected,
                    ]}
                    onPress={() =>
                      handleCustomerSelect({ id: item.id, name: item.name })
                    }
                  >
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{item.name}</Text>
                      {item.contacts?.email && (
                        <Text style={styles.customerEmail}>
                          {item.contacts.email}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCustomerModalVisible(false)}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Para Birimi Modal */}
        <Modal
          isVisible={currencyModalVisible}
          onBackdropPress={() => setCurrencyModalVisible(false)}
          style={styles.innerModal}
        >
          <View style={styles.innerModalContainer}>
            <Text style={styles.innerModalTitle}>Para Birimi Seç</Text>

            {currenciesLoading && <ActivityIndicator color="#25C5D1" />}
            {currenciesError && (
              <Text style={styles.errorText}>{currenciesError}</Text>
            )}

            {!currenciesLoading && !currenciesError && (
              <FlatList
                data={currencies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      selectedCurrency?.id === item.id && styles.listItemSelected,
                    ]}
                    onPress={() => handleCurrencySelect(item)}
                  >
                    <Text style={styles.listItemText}>
                      {item.title}
                      {item.symbol ? ` (${item.symbol})` : ""}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCurrencyModalVisible(false)}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default SelectCustomerModal;

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 16,
    color: "#25C5D1",
    alignSelf: "center",
  },
  innerModal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  innerModalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "70%",
  },
  innerModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
    color: "#333",
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemSelected: {
    backgroundColor: "#e6f7f8",
  },
  listItemText: {
    fontSize: 15,
    color: "#333",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  customerEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "#e74c3c",
    fontWeight: "600",
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
});