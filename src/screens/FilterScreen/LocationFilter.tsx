import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, InteractionManager } from "react-native";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";

import { getCountries, getCities, getDistrict, getStreet } from "../../../api/filterThunk";
import { setSelectedCountry } from "../../redux/Slice/countrySlice";
import { setSelectedCity } from "../../redux/Slice/filterSlice";
import { setSelectedDistrict } from "../../redux/Slice/districtSlice";
import { setSelectedStreet } from "../../redux/Slice/streetsSlice";

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
  const { data: district, loading: districtLoading, selectedDistrict } =
    useAppSelector((s) => s.district);
  const { data: streets, loading: streetsLoading, selectedStreet } =
    useAppSelector((s) => s.streets);

 useEffect(() => {
  if (isVisible) {
   
    const id = setTimeout(() => {
 
      if (!countries || countries.length === 0) {
        dispatch(getCountries());
      }
    }, 0);

    return () => clearTimeout(id);
  }
}, [isVisible]);


  const handleClearLocation = () => {
    dispatch(setSelectedCountry(null));
    dispatch(setSelectedCity(null));
    dispatch(setSelectedDistrict(null));
    dispatch(setSelectedStreet(null));
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={{ justifyContent: "flex-end", margin: 0 }}
      propagateSwipe
    >
      <View style={{ backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <View style={{ width: 45, height: 5, backgroundColor: "#ccc", borderRadius: 6, alignSelf: "center", marginBottom: 10 }} />

        <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "700", color: "#00A7C0" }}>
          Konum
        </Text>

        <ScrollView keyboardShouldPersistTaps="handled">
        
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Ülke</Text>
          {countriesLoading ? (
            <ActivityIndicator size="small" color="#00A7C0" />
          ) : (
            <Dropdown
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12 }}
              data={countries.map((c) => ({ label: c.title, value: c.id.toString() }))}
              value={selectedCountry}
              labelField="label"
              valueField="value"
              placeholder="Ülke seç"
              search
              onChange={(item) => {
                dispatch(setSelectedCountry(item.value));
                dispatch(getCities(item.value));
                dispatch(setSelectedCity(null));
                dispatch(setSelectedDistrict(null));
                dispatch(setSelectedStreet(null));
              }}
            />
          )}

        
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Şehir</Text>
          {citiesLoading ? (
            <ActivityIndicator size="small" color="#00A7C0" />
          ) : (
            <Dropdown
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12 }}
              data={cities.map((c) => ({ label: c.title, value: c.id.toString() }))}
              value={selectedCity}
              placeholder="Şehir seç"
              search
              disable={!selectedCountry}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                dispatch(setSelectedCity(item.value));
                dispatch(getDistrict(item.value));
                dispatch(setSelectedDistrict(null));
                dispatch(setSelectedStreet(null));
              }}
            />
          )}

   
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>İlçe</Text>
          {districtLoading ? (
            <ActivityIndicator size="small" color="#00A7C0" />
          ) : (
            <Dropdown
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12 }}
              data={district.map((d) => ({ label: d.title, value: d.id.toString() }))}
              value={selectedDistrict}
              placeholder="İlçe seç"
              search
              disable={!selectedCity}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                dispatch(setSelectedDistrict(item.value));
                dispatch(getStreet(item.value));
                dispatch(setSelectedStreet(null));
              }}
            />
          )}


          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Mahalle</Text>
          {streetsLoading ? (
            <ActivityIndicator size="small" color="#00A7C0" />
          ) : (
            <Dropdown
              style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12 }}
              data={streets.map((s) => ({ label: s.title, value: s.id.toString() }))}
              value={selectedStreet}
              placeholder="Mahalle seç"
              search
              disable={!selectedDistrict}
              labelField="label"
              valueField="value"
              onChange={(item) => dispatch(setSelectedStreet(item.value))}
            />
          )}

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              style={{ flex: 1, padding: 12, backgroundColor: "#bbb", borderRadius: 8, alignItems: "center" }}
              onPress={handleClearLocation}
            >
              <Text style={{ color: "#fff" }}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1, padding: 12, backgroundColor: "#41c4cf", borderRadius: 8, marginLeft: 10, alignItems: "center" }}
              onPress={onClose}
            >
              <Text style={{ color: "#fff" }}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LocationFilter;
