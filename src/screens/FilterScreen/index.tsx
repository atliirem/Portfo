import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";

import LocationFilterModal from "./LocationFilter"
import CategoryFilterModal from "./CategoryFilter";
import PriceFilterModal from "./PriceFilter";

const FilterScreen = () => {
  const [search, setSearch] = useState("");
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const [visiblePrice, setVisiblePrice] = useState(false);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      

      <TextInput
        placeholder="İlanlarda Ara"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />


      <View style={styles.filterContainer}>
        
        <TouchableOpacity style={styles.filterButtonWide} onPress={() => setVisibleCategory(true)}>
          <Text style={styles.filterButtonText}>Kategori</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={() => setVisiblePrice(true)}>
          <Text style={styles.filterButtonText}>Fiyat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={() => setVisibleLocation(true)}>
          <Text style={styles.filterButtonText}>Konum</Text>
        </TouchableOpacity>

      </View>


      <LocationFilterModal isVisible={visibleLocation} onClose={() => setVisibleLocation(false)} />

      <CategoryFilterModal isVisible={visibleCategory} onClose={() => setVisibleCategory(false)} />

      <PriceFilterModal isVisible={visiblePrice} onClose={() => setVisiblePrice(false)} />

    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  search: {
    backgroundColor: "#F6F6F6",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  filterButtonWide: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 150,
    alignItems: "center",
  },

  filterButton: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 90,
    alignItems: "center",
  },

  filterButtonText: {
    color: "#7a7a7a",
    fontSize: 15,
    fontWeight: "600",
  },
});
