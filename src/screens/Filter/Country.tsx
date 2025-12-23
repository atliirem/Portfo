import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks"
import { setSelectedCountry } from "../../redux/Slice/countrySlice";

import { getCountries } from "../../../api";

const CountryFilter = () => {
  const dispatch = useAppDispatch();
  const { data , loading, error, selectedCountry } = useAppSelector(
    (state) => state.country
  );

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kategori Seç</Text>

      {loading && <ActivityIndicator size="small" color="#00A6A6" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <Picker
        selectedValue={selectedCountry}
        onValueChange={(value) => dispatch(setSelectedCountry(value))}
      >
        <Picker.Item label="Tümü" value="" />
        {data.map((country: any) => (
          <Picker.Item
            key={country.id}
            label={country.title || country.name}
            value={country.id.toString()}
          />
        ))}
      </Picker>

      {selectedCountry && (
        <Text style={styles.selectedText}>
          Seçilen kategori ID: {selectedCountry}
        </Text>
      )}
    </View>
  );
};

export default CountryFilter;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  selectedText: { marginTop: 20, color: "#00A6A6", fontWeight: "600" },
  error: { color: "red", marginTop: 10 },
});
