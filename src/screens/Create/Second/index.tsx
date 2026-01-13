import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAppSelector } from "../../../redux/Hooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import { resetCreateAd, setPass, setTitle } from "../../../redux/Slice/formSlice";

import TextInputUser from "../../../components/TextInput/TextInputUser";
import Location from "../Location";

import { PropertyFeatureForm } from "../PropertyForm";
import { getMyProperties } from "../../../../api";
import { mapStateToFormData } from "../../../redux/Slice/mapStateToFormData";
import { updateProperty } from "../../../../api/CreateThunk";

const Second = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const createAdData = useAppSelector((state) => state.form);
  const propertyId = createAdData.propertyId;

  const [isLoading, setIsLoading] = useState(false);

  const featureFormValidatorRef = useRef<(() => boolean) | null>(null);
  const featureFormValuesRef = useRef<Record<string, any>>({});

  const validateAll = () => {
    if (!propertyId) {
      Alert.alert(
        "Hata",
        "Property ID bulunamadı. Lütfen geri dönüp tekrar deneyin."
      );
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

    if (!createAdData.location.country || !createAdData.location.city) {
      Alert.alert("Hata", "Lütfen konum seçin.");
      return false;
    }

    const hasCommission = createAdData.commission.salePrice !== "";
    const hasPass =
      createAdData.pass.passPrice !== "" || createAdData.pass.salePrice !== "";

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
      const formData = mapStateToFormData(
        createAdData,
        featureFormValuesRef.current
      );

      // ✅ Debug: FormData içeriğini logla
      console.log("=== FormData Contents ===");
      try {
        for (let pair of (formData as any)._parts) {
          console.log(pair[0] + ":", pair[1]);
        }
      } catch (e) {
        console.log("FormData log error:", e);
      }

      console.log("İlan güncelleniyor, Property ID:", propertyId);

      const response = await updateProperty(propertyId!, formData);

      console.log("Update API yanıtı:", JSON.stringify(response, null, 2));

      if (!response || response.status !== "success") {
        // ✅ Debug: Hata detaylarını logla
        console.log("=== API Error Response ===");
        console.log("Response:", JSON.stringify(response, null, 2));

        if (response?.data?.errors) {
          const errorMessages = Object.entries(response.data.errors)
            .map(([key, messages]) => {
              console.log(`Error field: ${key}`, messages);
              const msgs = Array.isArray(messages)
                ? messages.join(", ")
                : messages;
              return `${key}: ${msgs}`;
            })
            .join("\n");
          Alert.alert("Eksik Bilgiler", errorMessages);
        } else if (response?.errors) {
          const errorMessages = Object.entries(response.errors)
            .map(([key, messages]) => {
              console.log(`Error field: ${key}`, messages);
              const msgs = Array.isArray(messages)
                ? messages.join(", ")
                : messages;
              return `${key}: ${msgs}`;
            })
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
      // ✅ Debug: Catch bloğunda hata detayları
      console.log("=== Catch Error Details ===");
      console.log("Error:", error);
      console.log("Error response:", error?.response);
      console.log("Error response data:", JSON.stringify(error?.response?.data, null, 2));
      console.log("Error data:", JSON.stringify(error?.data, null, 2));

      if (error?.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([key, messages]) => {
            console.log(`Error field: ${key}`, messages);
            const msgs = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${key}: ${msgs}`;
          })
          .join("\n");
        Alert.alert("Eksik Bilgiler", errorMessages);
      } else if (error?.data?.errors) {
        const errorMessages = Object.entries(error.data.errors)
          .map(([key, messages]) => {
            console.log(`Error field: ${key}`, messages);
            const msgs = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${key}: ${msgs}`;
          })
          .join("\n");
        Alert.alert("Eksik Bilgiler", errorMessages);
      } else {
        Alert.alert(
          "Hata",
          error?.message || "İşlem sırasında bir hata oluştu."
        );
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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Temel Bilgiler</Text>

          <TextInputUser
            placeholder="İlan Başlığı"
            value={createAdData.title}
            onChangeText={(t) => dispatch(setTitle(t))}
            editable={!isLoading}
          />

          <View style={{ marginTop: 10 }}>
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

        {/* <View style={styles.section}>
          <View style={styles.rowBetween}>
            <TextInputUser
              style={{ width: "48%" }}
              placeholder="Pass Fiyatı"
              value={createAdData.pass.passPrice}
              onChangeText={(s) => dispatch(setPass({ passPrice: s }))}
              keyboardType="numeric"
              editable={!isLoading}
            />

            <TextInputUser
              style={{ width: "48%" }}
              placeholder="Satış Fiyatı"
              value={createAdData.pass.salePrice}
              onChangeText={(t) => dispatch(setPass({ salePrice: t }))}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>
        </View> */}

        {propertyId && (
          <View style={styles.section}>
            <PropertyFeatureForm
              propertyTypeId={propertyId}
              onValidate={(fn) => (featureFormValidatorRef.current = fn)}
              onValuesChange={(values) => {
                featureFormValuesRef.current = values;
              }}
              disabled={isLoading}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Second;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFF", marginTop: 0 },
  scrollContainer: { paddingHorizontal: 10, paddingBottom: 75 },

  section: {
    backgroundColor: "#FFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#C4C4C4",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontWeight: "700",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#25C5D1",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  disabledButton: {
    opacity: 0.6,
  },
});