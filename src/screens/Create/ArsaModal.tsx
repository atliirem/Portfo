import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";

import { getCurrencies } from "../../../api";
import { setSelectedCurrency as setSelectedCurrencyRedux } from "../../redux/Slice/currenciesSlice";

import { setPass, setPrice, setCommission } from "../../redux/Slice/formSlice";
import TextInputUser from "../../components/TextInput/TextInputUser";

const ArsaModal = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const {
    data: currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useAppSelector((state) => state.currencies);

  const pass = useAppSelector((state) => state.form.pass);

  useEffect(() => {
    dispatch(getCurrencies());
  }, [dispatch]);

  const handleCurrencySelect = (title: string, id: number) => {
    dispatch(setPrice({ currency: title, currencyId: id }));
    dispatch(setCommission({ currency: title, currencyId: id }));
    dispatch(setPass({ currency: title, currencyId: id }));
    dispatch(setSelectedCurrencyRedux(id));
    setCurrencyModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Fiyat Bilgileri</Text>

      <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
        <TextInputUser
          isModal
          placeholder="Para birimi seç"
          value={pass.currency || ""}
          editable={false}
          onChangeText={() => {}}
        />
      </TouchableOpacity>

      <Modal
        isVisible={currencyModalVisible}
        onBackdropPress={() => setCurrencyModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Para Birimi Seç</Text>

          {currenciesLoading && <ActivityIndicator color="#25C5D1" />}
          {currenciesError && <Text style={styles.errorText}>{currenciesError}</Text>}

          {!currenciesLoading && !currenciesError && (
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCurrencySelect(item.title, item.id)}
                >
                  <Text style={styles.categoryItemText}>
                    {item.title}
                    {item.symbol ? ` (${item.symbol})` : ""}
                  </Text>
                </TouchableOpacity>
              )}
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

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <TextInputUser
            keyboardType="decimal-pad"
            inputMode="decimal"
            placeholder="Pass fiyatı"
            value={pass.passPrice || ""}
            onChangeText={(text) => dispatch(setPass({ passPrice: text }))}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInputUser
            inputMode="decimal"
            keyboardType="decimal-pad"
            placeholder="Satış fiyatı"
            value={pass.salePrice || ""}
            onChangeText={(text) => dispatch(setPass({ salePrice: text }))}
          />
        </View>
      </View>
    </View>
  );
};

export default ArsaModal;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingBottom: 30,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginVertical: 15,
    marginTop: -30
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    textAlign: "center",
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  categoryItemText: {
    fontSize: 15,
    color: "#333",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "red",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  inputWrapper: {
    width: "48%",
  },
});