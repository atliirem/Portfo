import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputUser from "../../components/TextInput/TextInputUser";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { setLocation } from "../../redux/Slice/formSlice";
import Ionicons from "@react-native-vector-icons/ionicons";
import { getCities, getCountries, getDistrict, getStreet } from "../../../api";

const { height: screenHeight } = Dimensions.get("window");

const Location = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useAppSelector((state) => state.form.location);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [streetsModalVisible, setStreetsModalVisible] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [streetSearch, setStreetSearch] = useState("");

  const { data: countries, loading: countriesLoading } = useAppSelector(
    (state) => state.country
  );
  const { data: cities, loading: citiesLoading } = useAppSelector(
    (state) => state.cities
  );
  const { data: district, loading: districtLoading } = useAppSelector(
    (state) => state.district
  );
  const { data: streets, loading: streetsLoading } = useAppSelector(
    (state) => state.streets
  );

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const filteredCountries =
    countries?.filter((c) =>
      c.title.toLowerCase().includes(countrySearch.toLowerCase())
    ) || [];

  const filteredCities =
    cities?.filter((c) =>
      c.title.toLowerCase().includes(citySearch.toLowerCase())
    ) || [];

  const filteredDistricts =
    district?.filter((d) =>
      d.title.toLowerCase().includes(districtSearch.toLowerCase())
    ) || [];

  const filteredStreets =
    streets?.filter((s) =>
      s.title.toLowerCase().includes(streetSearch.toLowerCase())
    ) || [];

  const selectCountryHandler = (name: string, id: string) => {
    dispatch(
      setLocation({
        country: id,
        countryName: name,
        city: "",
        cityName: "",
        district: "",
        districtName: "",
        streets: "",
        streetsName: "",
      })
    );
    dispatch(getCities(id));
    setCountryModalVisible(false);
    setCountrySearch("");
  };

  const selectCityHandler = (name: string, id: string) => {
    dispatch(
      setLocation({
        city: id,
        cityName: name,
        district: "",
        districtName: "",
        streets: "",
        streetsName: "",
      })
    );
    dispatch(getDistrict(id));
    setCitiesModalVisible(false);
    setCitySearch("");
  };

  const selectDistrictHandler = (name: string, id: string) => {
    dispatch(
      setLocation({
        district: id,
        districtName: name,
        streets: "",
        streetsName: "",
      })
    );
    dispatch(getStreet(id));
    setDistrictModalVisible(false);
    setDistrictSearch("");
  };

  const selectStreetHandler = (name: string, id: string) => {
    dispatch(
      setLocation({
        streets: id,
        streetsName: name,
      })
    );
    setStreetsModalVisible(false);
    setStreetSearch("");
  };

  const renderSelectionModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    loading: boolean,
    data: any[],
    onSelect: (name: string, id: string) => void,
    searchValue: string,
    setSearchValue: (val: string) => void
  ) => (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.modalContainer}>
        <View style={styles.dragIndicator} />
        <Text style={styles.modalTitle}>{title}</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Ara..."
            placeholderTextColor="#999"
            value={searchValue}
            onChangeText={setSearchValue}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={() => setSearchValue("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00A7C0" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => onSelect(item.title, item.id.toString())}
                activeOpacity={0.7}
              >
                <Text style={styles.listItemText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Konum Bilgileri</Text>

        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setCountryModalVisible(true)}
          activeOpacity={0.7}
        >
          <TextInputUser
            isModal
            placeholder="Ülke seç"
            value={location.countryName}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.inputWrapper, !location.country && styles.disabledWrapper]}
          disabled={!location.country}
          onPress={() => setCitiesModalVisible(true)}
          activeOpacity={0.7}
        >
          <TextInputUser
            isModal
            placeholder="Şehir seç"
            value={location.cityName}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.inputWrapper, !location.city && styles.disabledWrapper]}
          disabled={!location.city}
          onPress={() => setDistrictModalVisible(true)}
          activeOpacity={0.7}
        >
          <TextInputUser
            isModal
            placeholder="İlçe seç"
            value={location.districtName}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.inputWrapper, !location.district && styles.disabledWrapper]}
          disabled={!location.district}
          onPress={() => setStreetsModalVisible(true)}
          activeOpacity={0.7}
        >
          <TextInputUser
            isModal
            placeholder="Mahalle seç"
            value={location.streetsName}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <View style={styles.addressWrapper}>
    
          <TextInputUser
            placeholder="Detaylı adres bilgisi girin"
            value={location.address}
            onChangeText={(t) => dispatch(setLocation({ address: t }))}
            multiline
          />
        </View>
      </ScrollView>

      {renderSelectionModal(
        countryModalVisible,
        () => {
          setCountryModalVisible(false);
          setCountrySearch("");
        },
        "Ülke Seç",
        countriesLoading,
        filteredCountries,
        selectCountryHandler,
        countrySearch,
        setCountrySearch
      )}

      {renderSelectionModal(
        citiesModalVisible,
        () => {
          setCitiesModalVisible(false);
          setCitySearch("");
        },
        "Şehir Seç",
        citiesLoading,
        filteredCities,
        selectCityHandler,
        citySearch,
        setCitySearch
      )}

      {renderSelectionModal(
        districtModalVisible,
        () => {
          setDistrictModalVisible(false);
          setDistrictSearch("");
        },
        "İlçe Seç",
        districtLoading,
        filteredDistricts,
        selectDistrictHandler,
        districtSearch,
        setDistrictSearch
      )}

      {renderSelectionModal(
        streetsModalVisible,
        () => {
          setStreetsModalVisible(false);
          setStreetSearch("");
        },
        "Mahalle Seç",
        streetsLoading,
        filteredStreets,
        selectStreetHandler,
        streetSearch,
        setStreetSearch
      )}
    </SafeAreaView>
  );
};

export default Location;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginBottom: 10,
    marginTop: 10,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  addressWrapper: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#25C5D1",
    marginBottom: 8,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: screenHeight * 0.7,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    textAlign: "center",
    marginBottom: 12,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    color: "#333",
  },


  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listItemText: {
    fontSize: 15,
    color: "#333",
  },

  // Loader
  loaderContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 10,
    color: "#999",
    fontSize: 14,
  },


  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#999",
    fontSize: 15,
  },


  closeButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
});