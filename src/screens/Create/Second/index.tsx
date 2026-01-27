import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAppSelector, useAppDispatch } from "../../../redux/Hooks";

import { resetCreateAd, setTitle } from "../../../redux/Slice/formSlice";
import { clearFormFeatures } from "../../../redux/Slice/featureSlice";

import TextInputUser from "../../../components/TextInput/TextInputUser";
import Location from "../Location";

import { PropertyFeatureForm } from "../PropertyForm";
import { getMyProperties } from "../../../../api";
import { mapStateToFormData } from "../../../redux/Slice/mapStateToFormData";
import { updateProperty } from "../../../../api/CreateThunk";

const TAB_BAR_HEIGHT = 80;

const Second = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const createAdData = useAppSelector((state) => state.form);

  const propertyId = createAdData.propertyId;
  const categoryId = createAdData.selectedSubCategoryId || createAdData.selectedCategoryId;

  const [isLoading, setIsLoading] = useState(false);

  const featureFormValidatorRef = useRef<(() => boolean) | null>(null);
  const featureFormValuesRef = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      dispatch(clearFormFeatures());
    };
  }, [dispatch]);

  // Validasyon kontrolleri
  const isLocationValid = !!(createAdData.location.country && createAdData.location.city);
  const isMapValid = createAdData.mapCoordinates.isSet;
  const isGalleryValid = createAdData.galleryStatus.isValid;

  const validateAll = () => {
    if (!propertyId) {
      Alert.alert("Hata", "Property ID bulunamadı. Lütfen geri dönüp tekrar deneyin.");
      return false;
    }

    if (!createAdData.title.trim()) {
      Alert.alert("Hata", "Lütfen ilan başlığı girin.");
      return false;
    }

    if (!createAdData.selectedCategoryId) {
      Alert.alert("Hata", "Lütfen kategori seçin.");
      return false;
    }

    if (!isLocationValid) {
      Alert.alert("Hata", "Lütfen konum bilgilerini doldurun (Ülke ve Şehir zorunlu).");
      return false;
    }

    if (!isMapValid) {
      Alert.alert("Hata", "Lütfen 'Location' sekmesinden harita üzerinde konum belirleyin.");
      return false;
    }

    if (!isGalleryValid) {
      Alert.alert("Hata", "Lütfen 'Gallery' sekmesinden en az 1 fotoğraf ekleyin.");
      return false;
    }

    const hasCommission = createAdData.commission.salePrice !== "";
    const hasPass = createAdData.pass.passPrice !== "" || createAdData.pass.salePrice !== "";

    if (!hasCommission && !hasPass) {
      Alert.alert("Hata", "Lütfen fiyat bilgilerini doldurun.");
      return false;
    }

    if (featureFormValidatorRef.current) {
      if (!featureFormValidatorRef.current()) {
        Alert.alert("Hata", "Tüm gerekli özellikleri doldurun.");
        return false;
      }
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const formData = mapStateToFormData(createAdData, featureFormValuesRef.current);
      const response = await updateProperty(propertyId!, formData);

      if (!response || response.status !== "success") {
        if (response?.data?.errors || response?.errors) {
          const errors = response?.data?.errors || response?.errors;
          const errorMessages = Object.entries(errors)
            .map(([_, messages]) => Array.isArray(messages) ? messages.join(", ") : messages)
            .join("\n");
          Alert.alert("Eksik Bilgiler", errorMessages);
        } else {
          Alert.alert("Hata", response?.message || "İşlem başarısız!");
        }
        setIsLoading(false);
        return;
      }

      const ilanNo = response?.data?.property?.no || "-";
      await dispatch(getMyProperties()).unwrap();

      Alert.alert("Başarılı", `İlan başarıyla güncellendi!\nİlan No: ${ilanNo}`, [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(resetCreateAd());
            navigation.navigate("PropertiesScreenProfile" as never);
          },
        },
      ]);
    } catch (error: any) {
      const errors = error?.response?.data?.errors || error?.data?.errors;
      if (errors) {
        const errorMessages = Object.entries(errors)
          .map(([_, messages]) => Array.isArray(messages) ? messages.join(", ") : messages)
          .join("\n");
        Alert.alert("Eksik Bilgiler", errorMessages);
      } else {
        Alert.alert("Hata", error?.message || "İşlem sırasında bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentCurrency =
    createAdData.pass.currency ||
    createAdData.price.currency ||
    createAdData.commission.currency ||
    "";

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Temel Bilgiler</Text>

            <TextInputUser
              placeholder="İlan Başlığı"
              value={createAdData.title}
              onChangeText={(t) => dispatch(setTitle(t))}
              editable={!isLoading}
            />

            <View style={styles.inputWrapper}>
              <TextInputUser
                placeholder="Para Birimi"
                value={currentCurrency}
                editable={false}
                onChangeText={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Location />
          </View>

          {categoryId && (
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>İlan Özellikleri</Text>
              <PropertyFeatureForm
                propertyTypeId={categoryId}
                onValidate={(fn) => (featureFormValidatorRef.current = fn)}
                onValuesChange={(values) => {
                  featureFormValuesRef.current = values;
                }}
                disabled={isLoading}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottomButtonContainer, { bottom: TAB_BAR_HEIGHT }]}>
        <TouchableOpacity
          style={[styles.backButton, isLoading && styles.disabledButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleFinalSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>İlanı Yayınla</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Second;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoid: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 160 },
  section: { marginBottom: 16 },
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#25C5D1", marginBottom: 10 },
  inputWrapper: { marginTop: 10 },
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  backButton: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: { color: "#666", fontWeight: "700", fontSize: 16 },
  submitButton: {
    flex: 1,
    backgroundColor: "#25C5D1",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disabledButton: { opacity: 0.6 },
});