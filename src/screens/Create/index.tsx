import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputUser from "../../components/TextInput/TextInputUser";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getTypes } from "../../../api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";


import {
  setTitle,
  setCategory,
  setSubCategory,
} from "../../redux/Slice/formSlice";

import Location from "./Location";
import PriceComponents from "../../components/PriceComponents";
import ArsaModal from "./ArsaModal";
import Apartman from "./Proje/Apartman";
import Villa from "./Proje/Villa";

type RootStackParamList = {
  Second: undefined;
};

const Create = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const createAdData = useAppSelector((state) => state.form);
  const { titles: categories } = useAppSelector((state) => state.types);


  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);


  const [errors, setErrors] = useState({
    title: false,
    category: false,
    subCategory: false,
  });


  const villaValidatorRef = useRef<(() => boolean) | null>(null);
  const apartmanValidatorRef = useRef<(() => boolean) | null>(null);

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);


  const validateFields = () => {
    const newErrors = {
      title: createAdData.title.trim() === "",
      category: createAdData.selectedCategory.trim() === "",
      subCategory:
        createAdData.selectedCategoryId === 29
          ? createAdData.selectedSubCategory.trim() === ""
          : false,
    };

    setErrors(newErrors);


    if (createAdData.selectedSubCategoryId === 34 && villaValidatorRef.current) {
      if (!villaValidatorRef.current()) return false;
    }


    if (createAdData.selectedSubCategoryId === 35 && apartmanValidatorRef.current) {
      if (!apartmanValidatorRef.current()) return false;
    }

    return !Object.values(newErrors).includes(true);
  };


  const handleTitleChange = (text: string) => {
    dispatch(setTitle(text));
    if (text.trim() !== "") {
      setErrors((prev) => ({ ...prev, title: false }));
    }
  };

  const handleCategorySelect = (label: string, id: number) => {
    dispatch(setCategory({ label, id }));
    setErrors((prev) => ({ ...prev, category: false }));
    setCategoryModalVisible(false);
  };

  const handleSubCategorySelect = (label: string, id: number) => {
    dispatch(setSubCategory({ label, id }));
    setErrors((prev) => ({ ...prev, subCategory: false }));
    setSubCategoryModalVisible(false);
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      console.log("Validation failed!");
      return;
    }

    console.log("Form submitted with data:", createAdData);
    navigation.navigate("Second");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionHeader}>Temel Bilgiler</Text>


        <TextInputUser
          placeholder="İlan başlığı girin"
          value={createAdData.title}
          onChangeText={handleTitleChange}
          error={errors.title}
        />


        <TouchableOpacity
          onPress={() => setCategoryModalVisible(true)}
          style={{ marginTop: 10 }}
        >
          <TextInputUser
            isModal={true}
            placeholder="Kategori seç"
            value={createAdData.selectedCategory}
            editable={false}
            error={errors.category}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

  
        <Modal
          isVisible={categoryModalVisible}
          onBackdropPress={() => setCategoryModalVisible(false)}
          style={styles.modal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Kategori Seç</Text>

            <FlatList
              data={categories.filter((item) => !item.parent)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(item.label, item.id)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>

     
        {createAdData.selectedCategoryId === 29 && (
          <TouchableOpacity
            onPress={() => setSubCategoryModalVisible(true)}
            style={{ marginTop: 10 }}
          >
            <TextInputUser
              isModal={true}
              placeholder="Alt kategori seç"
              value={createAdData.selectedSubCategory}
              editable={false}
              error={errors.subCategory}
              onChangeText={() => {}}
            />
          </TouchableOpacity>
        )}


        <Modal
          isVisible={subCategoryModalVisible}
          onBackdropPress={() => setSubCategoryModalVisible(false)}
          style={styles.modal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alt Kategori Seç</Text>

            <FlatList
              data={categories.filter(
                (item) => item.parent === createAdData.selectedCategory
              )}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleSubCategorySelect(item.label, item.id)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>


        <Location />


        {createAdData.selectedCategoryId === 27 && <PriceComponents />}
        {createAdData.selectedCategoryId === 21 && <PriceComponents />}
        {createAdData.selectedCategoryId === 9 && <ArsaModal />}
        {createAdData.selectedCategoryId === 10 && <ArsaModal />}

       
        {createAdData.selectedSubCategoryId === 34 && (
          <Villa onValidate={(fn) => (villaValidatorRef.current = fn)} />
        )}

        {createAdData.selectedSubCategoryId === 35 && (
          <Apartman onValidate={(fn) => (apartmanValidatorRef.current = fn)} />
        )}


        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginVertical: 15,
  },
  modal: { margin: 0, justifyContent: "flex-end" },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
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
  button: {
    marginTop: 25,
    backgroundColor: "#25C5D1",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});


/// şimdi şöyle: ben bu şekilde validation form ile yapıyordum ilan oluşturma olayını ama apide required, children, multiple gibi bir sürü detay var. apiden gelenlere göre yapmak lazım mesela select= true ise seçmeli bir modal kullanmalıyız, select= false ise normal textinput olmalı gibi gibi her şeyi apiden gelenlere göre yapmalıyız ama nasıl yapacağımı da bilmiyorum. zaten validate form olayını da çok anlamamıştım. Bana çok yardım etmen lazım. 