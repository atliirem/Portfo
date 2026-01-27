import React, { useState, useRef, useEffect } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { RootState } from "../../redux/store";

import {
  loadPropertyToForm,
  resetCreateAd,
  setPass,
  setTitle,
} from "../../redux/Slice/formSlice";

import { mapStateToFormData } from "../../redux/Slice/mapStateToFormData";
import { updateProperty } from "../../../api/CreateThunk";
import { getMyProperties, getProperties } from "../../../api";

import TextInputUser from "../../components/TextInput/TextInputUser";
import Location from "../Create/Location";
import { PropertyFeatureForm } from "../Create/PropertyForm";

type EditPropertyRouteParams = {
  EditProperty: { propertyId: number };
};

const EditProperty = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<EditPropertyRouteParams, "EditProperty">>();
  const propertyId = route.params?.propertyId;

  const createAdData = useAppSelector((state) => state.form);
  const { myList, property } = useSelector(
    (state: RootState) => state.properties
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const featureFormValidatorRef = useRef<(() => boolean) | null>(null);
  const featureFormValuesRef = useRef<Record<string, any>>({});


  useEffect(() => {
    if (!propertyId) {
      Alert.alert("Hata", "İlan bilgisi bulunamadı.");
      navigation.goBack();
      return;
    }

    const loadData = async () => {
      setIsLoadingData(true);

      try {
        const listItem = myList.find((p) => p.id === propertyId);
        console.log(" myList'te bulundu mu:", !!listItem);


        console.log(" Detay API'den çekiliyor...");
        const detailResult = await dispatch(getProperties(propertyId)).unwrap();
        console.log(" Detay API sonucu:", detailResult);

        const propertyData = detailResult || listItem;

        if (!propertyData) {
          Alert.alert("Hata", "İlan bulunamadı.");
          navigation.goBack();
          return;
        }

        console.log(" İlan bulundu, forma yükleniyor:", propertyData.title);
        dispatch(loadPropertyToForm(propertyData));
        
      } catch (e) {
        console.error(" İlan yükleme hatası:", e);
        
        const listItem = myList.find((p) => p.id === propertyId);
        if (listItem) {
          console.log(" API başarısız, myList'ten yükleniyor");
          dispatch(loadPropertyToForm(listItem));
        } else {
          Alert.alert("Hata", "İlan verileri yüklenemedi.");
          navigation.goBack();
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [propertyId, dispatch]);


  useEffect(() => {
    if (property && property.id === propertyId && !isLoadingData) {
      console.log(" Property state güncellendi, forma yükleniyor");
      dispatch(loadPropertyToForm(property));
    }
  }, [property, propertyId]);

  const validateAll = () => {
    if (!propertyId) {
      Alert.alert("Hata", "Property ID bulunamadı.");
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

  const handleUpdate = async () => {
    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const formData = mapStateToFormData(
        createAdData,
        Object.keys(featureFormValuesRef.current).length
          ? featureFormValuesRef.current
          : createAdData.extraFeatures
      );

      console.log(" Güncelleme gönderiliyor:", formData);

      const response = await updateProperty(propertyId!, formData);

      console.log("Update API yanıtı:", response);

      if (!response || response.status !== "success") {
        if (response?.data?.errors) {
          const errorMessages = Object.entries(response.data.errors)
            .map(([key, messages]) => {
              const msgs = Array.isArray(messages) ? messages.join(", ") : messages;
              return `${msgs}`;
            })
            .join("\n");
          Alert.alert("Eksik Bilgiler", errorMessages);
        } else {
          Alert.alert("Hata", response?.message || "İşlem başarısız!");
        }
        setIsLoading(false);
        return;
      }

      const ilanNo = response?.data?.property?.no || " ";

      await dispatch(getMyProperties(1)).unwrap();

      Alert.alert("Başarılı", `İlan başarıyla güncellendi!\nİlan No: ${ilanNo}`, [
        {
          text: "Tamam",
          onPress: () => {
            dispatch(resetCreateAd());
            navigation.navigate('PropertiesScreenProfile' as never);
          },
        },
      ]);
    } catch (error: any) {
      console.error(" Güncelleme hatası:", error);

      if (error?.data?.errors) {
        const errorMessages = Object.entries(error.data.errors)
          .map(([key, messages]) => {
            const msgs = Array.isArray(messages) ? messages.join(", ") : messages;
            return `${msgs}`;
          })
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

  if (!propertyId) {
    return null;
  }

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25C5D1" />
          <Text style={styles.loadingText}>İlan verileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

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


        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Fiyat Bilgileri</Text>
          <View style={styles.rowBetween}>
            <TextInputUser
              style={styles.priceInput}
              containerStyle={styles.priceInputContainer}
              placeholder="Pass Fiyatı"
              value={String(createAdData.pass.passPrice || "")}
              onChangeText={(s) => dispatch(setPass({ passPrice: s }))}
              keyboardType="numeric"
              editable={!isLoading}
            />

            <TextInputUser
              style={styles.priceInput}
              containerStyle={styles.priceInputContainer}
              placeholder="Satış Fiyatı"
              value={String(createAdData.pass.salePrice || "")}
              onChangeText={(t) => dispatch(setPass({ salePrice: t }))}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>
        </View>


        {createAdData.selectedCategoryId && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>İlan Özellikleri</Text>
            <PropertyFeatureForm
              propertyTypeId={createAdData.selectedCategoryId}
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
            onPress={() => {
              dispatch(resetCreateAd());
              navigation.navigate('Prof');
            }}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>İptal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Güncelle</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProperty;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", marginTop: 0 },
  scrollContainer: { paddingHorizontal: 10, paddingBottom: 75 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },

  section: {
    backgroundColor: "#fff",
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
    gap: 10,
  },

  priceInput: {
    width: "48%",
  },

  priceInputContainer: {
    minHeight: 56,
    paddingVertical: 16,
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