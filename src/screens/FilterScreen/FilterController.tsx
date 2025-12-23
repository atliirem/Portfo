import { Button, View } from "react-native";
import LocationFilter from "./LocationFilter";
import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";

const FilterController = () => {
  const [locationVisible, setLocationVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button title="Kategori" onPress={() => setCategoryVisible(true)} />
        <Button title="Fiyat" onPress={() => setPriceVisible(true)} />
        <Button title="Konum" onPress={() => setLocationVisible(true)} />
      </View>

      <LocationFilter visible={locationVisible} onClose={() => setLocationVisible(false)} />
      <CategoryFilter isVisible={categoryVisible} onClose={() => setCategoryVisible(false)} />
      <PriceFilter isVisible={priceVisible} onClose={() => setPriceVisible(false)} />
    </>
  );
};

export default FilterController;
