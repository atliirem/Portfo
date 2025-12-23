import React, { useState } from "react";
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

import {
  resetCreateAd,
  setPass,
  setTitle,
} from "../../../redux/Slice/formSlice";

import TextInputUser from "../../../components/TextInput/TextInputUser";
import Location from "../Location";

import { createProperty, getErrorMessage } from "../../../../api/propertyApi"

const Second = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const createAdData = useAppSelector((state) => state.form);
  

  const [isLoading, setIsLoading] = useState(false);

  const handleFinalSubmit = async () => {

    if (!createAdData.title.trim()) {
      Alert.alert("Hata", "Lütfen ilan başlığı girin.");
      return;
    }

    if (!createAdData.selectedCategoryId) {
      Alert.alert("Hata", "Lütfen kategori seçin.");
      return;
    }


    if (!createAdData.location.country || !createAdData.location.city) {
      Alert.alert("Hata", "Lütfen konum bilgilerini doldurun.");
      return;
    }


    const hasCommission = createAdData.commission.salePrice !== "";
    const hasPass = createAdData.pass.passPrice !== "" && createAdData.pass.salePrice !== "";

    if (!hasCommission && !hasPass) {
      Alert.alert("Hata", "Lütfen fiyat bilgilerini doldurun.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Gönderilen Veri:", createAdData);

    
      const response = await createProperty(createAdData);

      console.log("API Yanıtı:", response);


      Alert.alert(
        "Başarılı", 
        `İlan başarıyla oluşturuldu!\nİlan No: ${response.data.property}`,
        [
          {
            text: "Tamam",
            onPress: () => {
              dispatch(resetCreateAd());
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("İlan oluşturma hatası:", error);
      
      const errorMessage = getErrorMessage(error);
      
      Alert.alert("Hata", errorMessage, [
        {
          text: "Tamam",
          style: "cancel",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>İlanı Önizle & Düzenle</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Temel Bilgiler</Text>

          <TextInputUser
            placeholder="İlan Başlığı"
            value={createAdData.title}
            onChangeText={(t) => dispatch(setTitle(t))}
            editable={!isLoading}
          />

          <InfoEditRow
            label="Para Birimi"
            value={createAdData.price.currency}
            onPress={() => navigation.goBack()}
          />

          {createAdData.commission.salePrice !== "" && (
            <>
              <InfoEditRow
                label="Satış Fiyatı"
                value={createAdData.commission.salePrice}
                onPress={() => navigation.navigate("CommissionScreen" as never)}
              />

              <InfoEditRow
                label="Alıcı Komisyon (%)"
                value={createAdData.commission.buyerRate}
                onPress={() => navigation.navigate("CommissionScreen" as never)}
              />

              <InfoEditRow
                label="Satıcı Komisyon (%)"
                value={createAdData.commission.sellerRate}
                onPress={() => navigation.navigate("CommissionScreen" as never)}
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Location />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginRight: 10,
              marginTop: 10,
            }}
          >
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
        </View>

        

        {createAdData.selectedSubCategoryId === 34 ||
        createAdData.selectedSubCategoryId === 35 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Proje Bilgileri</Text>


             <TextInputUser
              style={{ width: "48%" }}
              placeholder="Satış Fiyatı"
              value={createAdData.pass.salePrice}
              onChangeText={(t) => dispatch(setPass({ salePrice: t }))}
              keyboardType="numeric"
              editable={!isLoading}
            />

            <InfoEditRow
              label="Oda Sayısı"
              value={createAdData.project.roomCount}
              onPress={() => navigation.navigate("ProjectScreen" as never)}
            />

            <InfoEditRow
              label="Min m²"
              value={createAdData.project.min}
              onPress={() => navigation.navigate("ProjectScreen" as never)}
            />

            <InfoEditRow
              label="Max m²"
              value={createAdData.project.max}
              onPress={() => navigation.navigate("ProjectScreen" as never)}
            />
          </View>
        ) : null}

   
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


const InfoEditRow = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string | number | undefined;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.infoRow} onPress={onPress}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || "Seçilmedi"}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFF" },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 50 },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    marginVertical: 20,
    textAlign: "center",
  },

  section: {
    backgroundColor: "#FFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 12,
  },

  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  infoValue: {
    fontSize: 14,
    color: "#222",
    marginTop: 3,
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