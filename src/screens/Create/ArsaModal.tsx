// imports
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputUser from "../../components/TextInput/TextInputUser";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getCurrencies } from "../../../api";
import { setSelectedCurrency as setSelectedCurrencyRedux } from "../../redux/Slice/currenciesSlice";

import { setPass, setPrice } from "../../redux/Slice/formSlice";

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

  const handleCurrencySelect = (currencyTitle: string, currencyId: number) => {

    dispatch(
      setPrice({
        currency: currencyTitle,
      })
    );


    dispatch(setSelectedCurrencyRedux(currencyId));

    setCurrencyModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

            {currenciesLoading && <ActivityIndicator color="#00A7C0" />}
            {currenciesError && (
              <Text style={{ color: "red" }}>{currenciesError}</Text>
            )}

            {!currenciesLoading && !currenciesError && (
              <FlatList
                data={currencies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleCurrencySelect(item.title, item.id)}
                  >
                    <Text>
                      {item.title} ({item.symbol})
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
              placeholder="Pass fiyatı"
              value={pass.passPrice || ""}
              onChangeText={(text) => dispatch(setPass({ passPrice: text }))}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInputUser
              placeholder="Satış fiyatı"
              value={pass.salePrice || ""}
              onChangeText={(text) => dispatch(setPass({ salePrice: text }))}
            />
          </View>
        </View>
{/* 
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Yeni İlan Oluştur</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArsaModal;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {},

  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 12,
  },

  modal: { margin: 0, justifyContent: "flex-end" },
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  inputWrapper: {
    width: "48%",
  },

  button: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25C5D1",
    borderRadius: 8,
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
