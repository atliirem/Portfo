import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

import TextInputUser from "../../../components/TextInput/TextInputUser";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useAppSelector } from "../../../redux/Hooks";

import { getCurrencies } from "../../../../api";

import { setPass } from "../../../redux/Slice/formSlice";
import { setSelectedCurrency } from "../../../redux/Slice/currenciesSlice";

const Pass = () => {
  const dispatch = useDispatch<AppDispatch>();

  const pass = useAppSelector((state) => state.form.pass);

  const {
    data: currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useAppSelector((state) => state.currencies);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getCurrencies());
  }, [dispatch]);

  // Para birimi seçimi
  const handleCurrencySelect = (currencyTitle: string, currencyId: number) => {
    dispatch(
      setPass({
        currency: currencyTitle,
      })
    );

    dispatch(setSelectedCurrency(currencyId));
    setCurrencyModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
   
        <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
          <TextInputUser
                      isModal
                      placeholder="Para birimi seç"
                      value={pass.currency || ""}
                      editable={false} onChangeText={function (t: string): void {
                          throw new Error("Function not implemented.");
                      } }          />
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
          </View>
        </Modal>


        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <View style={{ width: "48%" }}>
            <TextInputUser
              placeholder="Pass fiyatı"
              value={pass.passPrice || ""}
              onChangeText={(text) => dispatch(setPass({ passPrice: text }))}
            />
          </View>

          <View style={{ width: "48%" }}>
            <TextInputUser
              placeholder="Satış Fiyatı"
              value={pass.salePrice || ""}
              onChangeText={(text) => dispatch(setPass({ salePrice: text }))}
            />
          </View>
        </View>


        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pass;

//
// STYLES
//
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {},
  modal: { margin: 0, justifyContent: "flex-end" },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
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
