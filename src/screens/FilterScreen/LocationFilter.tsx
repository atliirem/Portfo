import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";

import { setSelectedCountry } from "../../redux/Slice/countrySlice";
import { setSelectedCity } from "../../redux/Slice/citySlice";
import { setSelectedDistrict } from "../../redux/Slice/districtSlice";
import { setSelectedStreet } from "../../redux/Slice/streetsSlice";
import { getCities, getCountries, getDistrict, getStreet } from "../../../api";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const LocationFilter = ({ isVisible, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { data: countries, loading: countriesLoading, selectedCountry } =
    useAppSelector((s) => s.country);
  const { data: cities, loading: citiesLoading, selectedCity } =
    useAppSelector((s) => s.cities);
  const { data: districts, loading: districtLoading, selectedDistrict } =
    useAppSelector((s) => s.district);
  const { data: streets, loading: streetsLoading, selectedStreet } =
    useAppSelector((s) => s.streets);

  useEffect(() => {
    if (isVisible && (!countries || countries.length === 0)) {
      dispatch(getCountries());
    }
  }, [isVisible, countries, dispatch]);

  const handleCountryChange = (item: { label: string; value: string }) => {
    dispatch(setSelectedCountry(item.value));
    dispatch(getCities(item.value));
    dispatch(setSelectedCity(null));
    dispatch(setSelectedDistrict(null));
    dispatch(setSelectedStreet(null));
  };

  const handleCityChange = (item: { label: string; value: string }) => {
    dispatch(setSelectedCity(item.value));
    dispatch(getDistrict(item.value));
    dispatch(setSelectedDistrict(null));
    dispatch(setSelectedStreet(null));
  };

  const handleDistrictChange = (item: { label: string; value: string }) => {
    dispatch(setSelectedDistrict(item.value));
    dispatch(getStreet(item.value));
    dispatch(setSelectedStreet(null));
  };

  const handleStreetChange = (item: { label: string; value: string }) => {
    dispatch(setSelectedStreet(item.value));
  };

  const handleClearLocation = () => {
    dispatch(setSelectedCountry(null));
    dispatch(setSelectedCity(null));
    dispatch(setSelectedDistrict(null));
    dispatch(setSelectedStreet(null));
  };

  const hasSelection = !!selectedCountry;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Konum</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Ülke */}
          <Text style={styles.label}>Ülke</Text>
          {countriesLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color="#00A7C0" />
            </View>
          ) : (
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.inputSearch}
              data={countries?.map((c) => ({ label: c.title, value: c.id.toString() })) || []}
              value={selectedCountry}
              labelField="label"
              valueField="value"
              placeholder="Ülke seç"
              search
              searchPlaceholder="Ara..."
              onChange={handleCountryChange}
            />
          )}

          {/* Şehir */}
          <Text style={styles.label}>Şehir</Text>
          {citiesLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color="#00A7C0" />
            </View>
          ) : (
            <Dropdown
              style={[styles.dropdown, !selectedCountry && styles.disabledDropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.inputSearch}
              data={cities?.map((c) => ({ label: c.title, value: c.id.toString() })) || []}
              value={selectedCity}
              placeholder="Şehir seç"
              search
              searchPlaceholder="Ara..."
              disable={!selectedCountry}
              labelField="label"
              valueField="value"
              onChange={handleCityChange}
            />
          )}

          {/* İlçe */}
          <Text style={styles.label}>İlçe</Text>
          {districtLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color="#00A7C0" />
            </View>
          ) : (
            <Dropdown
              style={[styles.dropdown, !selectedCity && styles.disabledDropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.inputSearch}
              data={districts?.map((d) => ({ label: d.title, value: d.id.toString() })) || []}
              value={selectedDistrict}
              placeholder="İlçe seç"
              search
              searchPlaceholder="Ara..."
              disable={!selectedCity}
              labelField="label"
              valueField="value"
              onChange={handleDistrictChange}
            />
          )}

          {/* Mahalle */}
          <Text style={styles.label}>Mahalle</Text>
          {streetsLoading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color="#00A7C0" />
            </View>
          ) : (
            <Dropdown
              style={[styles.dropdown, !selectedDistrict && styles.disabledDropdown]}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              inputSearchStyle={styles.inputSearch}
              data={streets?.map((s) => ({ label: s.title, value: s.id.toString() })) || []}
              value={selectedStreet}
              placeholder="Mahalle seç"
              search
              searchPlaceholder="Ara..."
              disable={!selectedDistrict}
              labelField="label"
              valueField="value"
              onChange={handleStreetChange}
            />
          )}

          {/* Butonlar */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.clearButton, !hasSelection && styles.disabledButton]}
              onPress={handleClearLocation}
              disabled={!hasSelection}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LocationFilter;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheet: {
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
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: "#F8F9FA",
  },
  disabledDropdown: {
    backgroundColor: "#F0F0F0",
    opacity: 0.6,
  },
  dropdownContainer: {
    borderRadius: 10,
    borderColor: "#E0E0E0",
  },
  placeholder: {
    color: "#999",
    fontSize: 15,
  },
  selectedText: {
    color: "#333",
    fontSize: 15,
  },
  inputSearch: {
    height: 44,
    fontSize: 15,
    borderRadius: 8,
  },
  loaderBox: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#B0B0B0",
    borderRadius: 10,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#00A7C0",
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});