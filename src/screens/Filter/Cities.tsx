
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { setSelectedCity } from "../../redux/Slice/filterSlice"
import { getCities } from "../../../api/filterThunk";
import { SelectCountry } from "react-native-element-dropdown";


const CitiesFilter = () => {
  const dispatch = useAppDispatch();
  const { data , loading, error, selectedCity } = useAppSelector(
    (state) => state.cities
  );
  const { selectedCountry } = useAppSelector(
    (state) => state.country
  );


  useEffect(() => {
    if (selectedCountry) {
      dispatch(getCities(selectedCountry));
    }
  }, [dispatch, selectedCountry]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Şehir Seç</Text>

      {loading && <ActivityIndicator size="small" color="#00A6A6" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <Picker
        enabled={!!selectedCountry} 
        selectedValue={selectedCity}
        onValueChange={(value) => dispatch(setSelectedCity(value))}
      >
        <Picker.Item label="Tümü" value="" />
        {data.map((city: any) => (
          <Picker.Item
            key={city.id}
            label={city.title || city.name}
            value={city.id.toString()}
          />
        ))}
      </Picker>

      {selectedCity && (
        <Text style={styles.selectedText}>
          Seçilen şehir ID: {selectedCity}
        </Text>
      )}
    </View>
  );
};

export default CitiesFilter;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  selectedText: { marginTop: 20, color: "#00A6A6", fontWeight: "600" },
  error: { color: "red", marginTop: 10 },
});