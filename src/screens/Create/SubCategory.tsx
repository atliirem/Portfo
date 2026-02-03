// imports
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputUser from "../../components/TextInput/TextInputUser";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getCountries, getCities, getDistrict, getStreet } from "../../../api/publicApi";
import { getCurrencies, getTypes } from "../../../api";
import { setSelectedCurrency as setSelectedCurrencyRedux } from "../../redux/Slice/currenciesSlice";
import Location from "./Location";
import ArsaModal from "./ArsaModal";
import PriceComponents from "../../components/PriceComponents";


const Create = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [adress, setAdress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


  const [categoryModalVisible, setCategoryModalVisible] = useState(false);


  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [streetsModalVisible, setStreetsModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);



  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(27);
   const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [selectedCurrencyLocal, setSelectedCurrencyLocal] = useState("");

  const { data: currencies, loading: currenciesLoading, error: currenciesError } =
    useAppSelector((state) => state.currencies);
  const { titles: categories, loading: categoriesLoading, error: categoriesError } =
    useAppSelector((state) => state.types);
  const { data: countries, loading: countriesLoading, error: countriesError } =
    useAppSelector((state) => state.country);
  const { data: cities, loading: citiesLoading, error: citiesError } =
    useAppSelector((state) => state.cities);
  const { data: district, loading: districtLoading, error: districtError } =
    useAppSelector((state) => state.district);
  const { data: streets, loading: streetsLoading, error: streetsError } =
    useAppSelector((state) => state.streets);

  useEffect(() => {
    dispatch(getTypes());
    dispatch(getCountries());
    dispatch(getCurrencies());
  }, [dispatch]);

  // const selectCategory = (category: string) => {
  //   setSelectedCategory(category);
  //   setCategoryModalVisible(false);
  // };

  const selectCategory = (label: string, id: number) => {
    setSelectedSubCategory(label);
    setSelectedCategoryId(id);
    setCategoryModalVisible(false);
  };


 
  const selectCurrencyHandler = (currencyTitle: string, currencyId: number) => {
    setSelectedCurrencyLocal(currencyTitle);
    dispatch(setSelectedCurrencyRedux(currencyId));
    setCurrencyModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
         

          <TouchableOpacity
            style={{ marginTop: 10, }}
            onPress={() => setCategoryModalVisible(true)}>
            <TextInputUser 
            isModal={true}
              placeholder="Alt kategori seç" value={selectedSubCategory} editable={false} onChangeText={function (t: string): void {
                throw new Error("Function not implemented.");
              }} />
          </TouchableOpacity>



        <Modal
  isVisible={categoryModalVisible}
  onBackdropPress={() => setCategoryModalVisible(false)}
  style={styles.modal}
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Alt Kategori Seç</Text>

    {categoriesLoading && <ActivityIndicator color="#00A7C0" />}
    {categoriesError && <Text style={{ color: "red" }}>{categoriesError}</Text>}

    {!categoriesLoading && !categoriesError && (
      <FlatList
        data={categories.filter(item => item.parent)}  
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => {
              const fullLabel = `${item.label}`;
              selectCategory(fullLabel, item.id);
              setCategoryModalVisible(false);
            }}
          >
            <Text> {item.label}</Text>  
          </TouchableOpacity>
        )}
      />
    )}

    <Button
      title="İptal"
      onPress={() => setCategoryModalVisible(false)}
      color="red"
    />
  </View>
</Modal>



        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { },
  section: { marginTop: 0, },
  sectionHeader: { fontSize: 16, fontWeight: "800", color: "#25C5D1", marginBottom: 15, marginTop: 0 },

  modal: { margin: 0, justifyContent: "flex-end" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 12, maxHeight: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14, justifyContent: 'center', textAlign: 'center' },
  categoryItem: {
    paddingVertical: 12, borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bfbebeff',
    borderRadius: 6.5,
    marginTop: 20,

  },

  textInput: {

  }
});

