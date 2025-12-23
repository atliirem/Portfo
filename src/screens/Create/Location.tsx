// imports
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  FlatList,
  ActivityIndicator,
  StatusBar,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputUser from "../../components/TextInput/TextInputUser";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getCountries, getCities, getDistrict, getStreet } from "../../../api/filterThunk";

import { setLocation } from "../../redux/Slice/formSlice";

const Location = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux'tan gelen mevcut kayıtlı konum
  const savedLocation = useAppSelector((state) => state.form.location);


  const [address, setAddress] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");

  // Modallar
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [streetsModalVisible, setStreetsModalVisible] = useState(false);

  // İlk açıldığında Redux'taki verileri local state'e set et
  useEffect(() => {
    setSelectedCountry(savedLocation.country || "");
    setSelectedCity(savedLocation.city || "");
    setSelectedDistrict(savedLocation.district || "");
    setSelectedStreet(savedLocation.streets || "");
    setAddress(savedLocation.address || "");
  }, []);

  // API state
  const { data: countries, loading: countriesLoading } =
    useAppSelector((state) => state.country);
  const { data: cities, loading: citiesLoading } =
    useAppSelector((state) => state.cities);
  const { data: district, loading: districtLoading } =
    useAppSelector((state) => state.district);
  const { data: streets, loading: streetsLoading } =
    useAppSelector((state) => state.streets);


  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  
  const selectCountryHandler = (country: string, id: string) => {
    setSelectedCountry(country);
    dispatch(setLocation({ country }));

    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedStreet("");

    dispatch(getCities(id));

    setCountryModalVisible(false);
  };

  const selectCityHandler = (city: string, id: string) => {
    setSelectedCity(city);
    dispatch(setLocation({ city }));

    setSelectedDistrict("");
    setSelectedStreet("");

    dispatch(getDistrict(id));

    setCitiesModalVisible(false);
  };

  const selectDistrictHandler = (districtName: string, id: string) => {
    setSelectedDistrict(districtName);
    dispatch(setLocation({ district: districtName }));

    setSelectedStreet("");

    dispatch(getStreet(id));

    setDistrictModalVisible(false);
  };

  const selectStreetHandler = (street: string) => {
    setSelectedStreet(street);
    dispatch(setLocation({ streets: street }));

    setStreetsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView>
        <Text style={styles.sectionHeader}>Konum Bilgileri</Text>

        {/* -------- ÜLKE -------- */}
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => setCountryModalVisible(true)}
        >
          <TextInputUser
            isModal
            placeholder="Ülke seç"
            value={selectedCountry}
            editable={false}
          />
        </TouchableOpacity>

        {/* ÜLKE MODAL */}
        <Modal
          isVisible={countryModalVisible}
          onBackdropPress={() => setCountryModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ülke Seç</Text>

            {countriesLoading ? (
              <ActivityIndicator color="#00A7C0" />
            ) : (
              <FlatList
                data={countries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => selectCountryHandler(item.title, item.id)}
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <Button
              title="Kapat"
              color="red"
              onPress={() => setCountryModalVisible(false)}
            />
          </View>
        </Modal>


        <TouchableOpacity
          style={{ marginTop: 10 }}
          disabled={!selectedCountry}
          onPress={() => setCitiesModalVisible(true)}
        >
          <TextInputUser
            isModal
            placeholder="Şehir seç"
            value={selectedCity}
            editable={false}
          />
        </TouchableOpacity>

        {/* ŞEHİR MODAL */}
        <Modal
          isVisible={citiesModalVisible}
          onBackdropPress={() => setCitiesModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Şehir Seç</Text>

            {citiesLoading ? (
              <ActivityIndicator color="#00A7C0" />
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => selectCityHandler(item.title, item.id)}
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <Button
              title="Kapat"
              color="red"
              onPress={() => setCitiesModalVisible(false)}
            />
          </View>
        </Modal>

        {/* -------- İLÇE -------- */}
        <TouchableOpacity
          style={{ marginTop: 10 }}
          disabled={!selectedCity}
          onPress={() => setDistrictModalVisible(true)}
        >
          <TextInputUser
            isModal
            placeholder="İlçe seç"
            value={selectedDistrict}
            editable={false}
          />
        </TouchableOpacity>

        {/* İLÇE MODAL */}
        <Modal
          isVisible={districtModalVisible}
          onBackdropPress={() => setDistrictModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>İlçe Seç</Text>

            {districtLoading ? (
              <ActivityIndicator color="#00A7C0" />
            ) : (
              <FlatList
                data={district}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() =>
                      selectDistrictHandler(item.title, item.id)
                    }
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <Button
              title="Kapat"
              color="red"
              onPress={() => setDistrictModalVisible(false)}
            />
          </View>
        </Modal>

        {/* -------- MAHALLE -------- */}
        <TouchableOpacity
          style={{ marginTop: 10 }}
          disabled={!selectedDistrict}
          onPress={() => setStreetsModalVisible(true)}
        >
          <TextInputUser
            isModal
            placeholder="Mahalle seç"
            value={selectedStreet}
            editable={false}
          />
        </TouchableOpacity>

        {/* MAHALLE MODAL */}
        <Modal
          isVisible={streetsModalVisible}
          onBackdropPress={() => setStreetsModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Mahalle Seç</Text>

            {streetsLoading ? (
              <ActivityIndicator color="#00A7C0" />
            ) : (
              <FlatList
                data={streets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => selectStreetHandler(item.title)}
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <Button
              title="Kapat"
              color="red"
              onPress={() => setStreetsModalVisible(false)}
            />
          </View>
        </Modal>

        {/* -------- ADRES -------- */}
        <View style={{ marginTop: 10 }}>
          <TextInputUser
            placeholder="Adres girin"
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              dispatch(setLocation({ address: t }));
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Location;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginTop: 20,
    marginBottom: 6,
  },

  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },

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
});
