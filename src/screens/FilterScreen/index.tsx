import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import Ionicons from "@react-native-vector-icons/ionicons";

import LocationFilterModal from "./LocationFilter";
import CategoryFilterModal from "./CategoryFilter";
import PriceFilterModal from "./PriceFilter";
import { setSearchQuery } from "../../redux/Slice/searchSlice";
import { getFilteredProperties } from "../../../api";

const FilterScreen = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.filteredProperties);

  const { selectedTypes } = useAppSelector((s) => s.types);
  const { selectedCountry } = useAppSelector((s) => s.country);
  const { selectedCity } = useAppSelector((s) => s.cities);
  const { selectedDistrict } = useAppSelector((s) => s.district);
  const { selectedStreet } = useAppSelector((s) => s.streets);
  const { minPrice, maxPrice } = useAppSelector((s) => s.price);
  const { selectedCurrencyId, selectedCurrencyCode } = useAppSelector((s) => s.currencies);

  const [search, setSearch] = useState("");
  const [visibleLocation, setVisibleLocation] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const [visiblePrice, setVisiblePrice] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);


  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    dispatch(getFilteredProperties(1));
  }, [
    selectedTypes,
    selectedCountry,
    selectedCity,
    selectedDistrict,
    selectedStreet,
    minPrice,
    maxPrice,
    selectedCurrencyId,
    debouncedSearch,
  ]);


  const hasCategoryFilter = selectedTypes && selectedTypes.length > 0;
  const hasLocationFilter = !!selectedCountry;
  const hasPriceFilter = !!minPrice || !!maxPrice || !!selectedCurrencyId;


  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="İlanlarda Ara..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={(text) => setSearch(text)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && (
          <ActivityIndicator size="small" color="#00A7C0" />
        )}
        {search.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>


      <View style={styles.filterContainer}>

        <TouchableOpacity
          style={[styles.filterButton, styles.filterButtonWide, hasCategoryFilter && styles.activeFilter]}
          onPress={() => setVisibleCategory(true)}
          activeOpacity={0.7}
        >
          
          <Text style={[styles.filterButtonText, hasCategoryFilter && styles.activeFilterText]}>
            Kategori {hasCategoryFilter ? `(${selectedTypes.length})` : ""}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.filterButton, hasPriceFilter && styles.activeFilter]}
          onPress={() => setVisiblePrice(true)}
          activeOpacity={0.7}
        >
          
          <Text style={[styles.filterButtonText, hasPriceFilter && styles.activeFilterText]}>
            {selectedCurrencyCode || "Fiyat"}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.filterButton, hasLocationFilter && styles.activeFilter]}
          onPress={() => setVisibleLocation(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterButtonText, hasLocationFilter && styles.activeFilterText]}>
            Konum
          </Text>
        </TouchableOpacity>
      </View>


      <LocationFilterModal
        isVisible={visibleLocation}
        onClose={() => setVisibleLocation(false)}
      />
      <CategoryFilterModal
        isVisible={visibleCategory}
        onClose={() => setVisibleCategory(false)}
      />
      <PriceFilterModal
        isVisible={visiblePrice}
        onClose={() => setVisiblePrice(false)}
      />
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
  },

  // Arama
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    color: "#333",
    height: "100%",
  },

  // Filtre Butonları
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  filterButtonWide: {
    flex: 1.3,
  },
  filterButtonText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  activeFilter: {
    backgroundColor: "#E8F7F9",
    borderColor: "#00A7C0",
  },
  activeFilterText: {
    color: "#00A7C0",
  },
});