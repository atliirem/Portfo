import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useAppSelector } from "../../../redux/Hooks";

import TextInputUser from "../../../components/TextInput/TextInputUser";
import { getCurrencies } from "../../../../api";

import { setCommission } from "../../../redux/Slice/formSlice";
import { setSelectedCurrency } from "../../../redux/Slice/currenciesSlice";

const Komisyon = () => {
  const dispatch = useDispatch<AppDispatch>();


  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  // Redux state
  const commission = useAppSelector((state) => state.form.commission);

  const {
    data: currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useAppSelector((state) => state.currencies);


  useEffect(() => {
    dispatch(getCurrencies());
  }, [dispatch]);


  const handleCurrencySelect = (currencyTitle: string, currencyId: number) => {
    dispatch(
      setCommission({
        currency: currencyTitle,
      })
    );

    dispatch(setSelectedCurrency(currencyId));
    setCurrencyModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
          <TextInputUser
            isModal={true}
            placeholder="Para birimi seç"
            value={commission.currency || ""}
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
                    onPress={() =>
                      handleCurrencySelect(item.title, item.id)
                    }
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


        <View style={{ marginTop: 15 }}>
          <TextInputUser
            placeholder="Satış Fiyatı"
            value={commission.salePrice || ""}
            onChangeText={(text) =>
              dispatch(setCommission({ salePrice: text }))
            }
          />
        </View>


        <View style={{ marginTop: 15 }}>
          <TextInputUser
            placeholder="Alıcı Komisyon Oranı (%)"
            value={commission.buyerRate || ""}
            onChangeText={(text) =>
              dispatch(setCommission({ buyerRate: text }))
            }
          />
        </View>

 
        <View style={{ marginTop: 15 }}>
          <TextInputUser
            placeholder="Satıcı Komisyon Oranı (%)"
            value={commission.sellerRate || ""}
            onChangeText={(text) =>
              dispatch(setCommission({ sellerRate: text }))
            }
          />
        </View>


        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Komisyon;

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
