import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/Hooks";
import { getTypes } from "../../../api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import TextInputUser from "../../components/TextInput/TextInputUser";

import {
  setTitle,
  setCategory,
  setSubCategory,
  setPropertyId,
} from "../../redux/Slice/formSlice";

import Location from "./Location";
import PriceComponents from "../../components/PriceComponents";
import ArsaModal from "./ArsaModal";
import Apartman from "./Proje/Apartman";
import Villa from "./Proje/Villa";

import { createProperty } from "../../../api/CreateThunk";
import { mapStateToFormData } from "../../redux/Slice/mapStateToFormData";

type RootStackParamList = {
  Second: undefined;
  Taslak: { propertyId: number; mode: 'create' | 'edit' };
};

const TAB_BAR_HEIGHT = 80;
const BUTTON_CONTAINER_HEIGHT = 70;

const Create = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const form = useAppSelector((s) => s.form);
  const { titles: categories } = useAppSelector((s) => s.types);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTitleChange = (text: string) => {
    dispatch(setTitle(text));
    if (text.trim() !== "") setErrors((prev) => ({ ...prev, title: false }));
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

  const validateFields = () => {
    const newErrors = {
      title: form.title.trim() === "",
      category: form.selectedCategory.trim() === "",
      subCategory:
        form.selectedCategoryId === 29 &&
        form.selectedSubCategory.trim() === "",
    };

    setErrors(newErrors);

    if (form.selectedSubCategoryId === 34 && villaValidatorRef.current) {
      if (!villaValidatorRef.current()) return false;
    }

    if (form.selectedSubCategoryId === 35 && apartmanValidatorRef.current) {
      if (!apartmanValidatorRef.current()) return false;
    }

    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      const formData = mapStateToFormData(form, {});

      const response = await createProperty(formData);

      if (response?.status !== "success") {
        if (response?.data?.errors) {
          const errorMessages = Object.values(response.data.errors)
            .flat()
            .join("\n");
          Alert.alert("Hata", errorMessages);
        } else {
          Alert.alert("Hata", response?.message || "Draft oluşturulamadı!");
        }
        return;
      }

      const propertyId = response?.data?.property?.id;

      if (!propertyId) {
        Alert.alert("Hata", "Property ID alınamadı!");
        return;
      }

      dispatch(setPropertyId(propertyId));

      navigation.navigate("Taslak", { propertyId, mode: 'create' });

    } catch (error: any) {
      if (error?.data?.errors) {
        const errorMessages = Object.values(error.data.errors)
          .flat()
          .join("\n");
        Alert.alert("Hata", errorMessages);
      } else {
        Alert.alert(
          "Hata",
          error?.message || "Draft oluşturulurken bir hata oluştu."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BUTTON_CONTAINER_HEIGHT + TAB_BAR_HEIGHT }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionHeader}>Temel Bilgiler</Text>

          <TextInputUser
            placeholder="İlan başlığı girin"
            value={form.title}
            onChangeText={handleTitleChange}
            error={errors.title}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => setCategoryModalVisible(true)}
            style={styles.inputWrapper}
            disabled={isLoading}
          >
            <TextInputUser
              isModal
              placeholder="Kategori seç"
              value={form.selectedCategory}
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

          {form.selectedCategoryId === 29 && (
            <TouchableOpacity
              onPress={() => setSubCategoryModalVisible(true)}
              style={styles.inputWrapper}
              disabled={isLoading}
            >
              <TextInputUser
                isModal
                placeholder="Alt kategori seç"
                value={form.selectedSubCategory}
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
                  (item) => item.parent === form.selectedCategory
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

          {(form.selectedCategoryId === 27 ||
            form.selectedCategoryId === 21) && <PriceComponents />}

          {(form.selectedCategoryId === 9 ||
            form.selectedCategoryId === 10) && <ArsaModal />}

          {form.selectedSubCategoryId === 34 && (
            <Villa onValidate={(fn) => (villaValidatorRef.current = fn)} />
          )}

          {form.selectedSubCategoryId === 35 && (
            <Apartman onValidate={(fn) => (apartmanValidatorRef.current = fn)} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomButtonContainer, { bottom: TAB_BAR_HEIGHT }]}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Devam Et</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginBottom: 8,
  },
  inputWrapper: {
    marginTop: 8,
  },
  modal: { 
    margin: 0, 
    justifyContent: "flex-end" 
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#25C5D1",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});