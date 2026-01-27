import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Button,
  FlatList,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/Hooks";
import { AppDispatch } from "../../../redux/store";
import { getTypes, getCurrencies } from "../../../../api";
import TextInputUser from "../../../components/TextInput/TextInputUser";
import ChildrenModal from "./ChildrenModal";

import {
  setPrice,
  setProject,
  addPriceOption,
  updatePriceOption,
  setLicenceFile,
} from "../../../redux/Slice/formSlice";
import FilePicker, { SelectedFile } from "../../../components/UploadFile/FileUploadExample";
import FileInputRPicker from "../../../components/UploadFile/FileUploadR";

const Apartman = ({ onValidate }: { onValidate: (fn: () => boolean) => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const createAdData = useAppSelector((state) => state.form);
  const { data: currencies, loading: currenciesLoading, error: currenciesError } =
    useAppSelector((state) => state.currencies);
  const { features } = useAppSelector((state) => state.types);

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [licenceFile, setLicenceFileState] = useState<SelectedFile | null>(
    createAdData.licenceFile || null
  );

  const [errors, setErrors] = useState({
    room: false,
    min: false,
    max: false,
    currency: false,
  });

  const roomFeature = features.find((f) => f.title === "Oda Sayısı");

  useEffect(() => {
    dispatch(getTypes());
    dispatch(getCurrencies());
  }, [dispatch]);

  useEffect(() => {
    if (createAdData.licenceFile) {
      setLicenceFileState(createAdData.licenceFile);
    }
  }, [createAdData.licenceFile]);

  const handleRoomSelect = (roomTitle: string) => {
    dispatch(setProject({ roomCount: roomTitle }));
    setErrors((prev) => ({ ...prev, room: false }));
    setRoomModalVisible(false);
  };

  const handleMinChange = (text: string) => {
    if (text === "") {
      dispatch(setProject({ min: "" }));
      return;
    }

    const num = Number(text);

    if (Number.isNaN(num)) {
      return;
    }

    if (num < 1) {
      Alert.alert("Geçersiz değer", "Minimum değer 1 olmalıdır.");
      return;
    }

    dispatch(setProject({ min: text }));
    setErrors((prev) => ({ ...prev, min: false }));
  };

  const handleMaxChange = (text: string) => {
    dispatch(setProject({ max: text }));
    if (text.trim() !== "") {
      setErrors((prev) => ({ ...prev, max: false }));
    }
  };

  const handleCurrencySelect = (currencyTitle: string, currencyId: number) => {
    dispatch(
      setPrice({
        currency: currencyTitle,
        currencyId: currencyId,
      })
    );
    setErrors((prev) => ({ ...prev, currency: false }));
    setCurrencyModalVisible(false);
  };

  const handleAddPriceOption = () => {
    dispatch(addPriceOption(""));
  };

  const handleUpdatePriceOption = (text: string, index: number) => {
    dispatch(updatePriceOption({ index, value: text }));
  };

  const handleDownloadPress = () => {
    Linking.openURL(
      "https://portfoy.demo.pigasoft.com/licence-of-authorization.pdf"
    );
  };

  const handleFileSelect = (file: SelectedFile | null) => {
    setLicenceFileState(file);
    dispatch(setLicenceFile(file));
  };

  const validate = () => {
    const newErrors = {
      room: createAdData.project.roomCount.trim() === "",
      min: createAdData.project.min.trim() === "",
      max: createAdData.project.max.trim() === "",
      currency: createAdData.price.currency.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  useEffect(() => {
    onValidate(() => validate());
  }, [
    createAdData.project.roomCount,
    createAdData.project.min,
    createAdData.project.max,
    createAdData.price.currency,
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Proje Apartman</Text>

          <TouchableOpacity
            onPress={() => setRoomModalVisible(true)}
            style={styles.inputWrapper}
          >
            <TextInputUser
              isModal={true}
              placeholder="Oda sayısı seç"
              value={createAdData.project.roomCount}
              editable={false}
              containerStyle={errors.room ? styles.errorInput : undefined}
              onChangeText={() => {}}
            />
          </TouchableOpacity>

          <ChildrenModal
            isVisible={roomModalVisible}
            onClose={() => setRoomModalVisible(false)}
            loading={false}
            options={roomFeature?.options ?? []}
            onSelect={(item) => handleRoomSelect(item.title)}
          />

          <View style={styles.inputWrapper}>
            <TextInputUser
              placeholder="Metrekare (m2) min"
              keyboardType="numeric"
              value={createAdData.project.min}
              containerStyle={errors.min ? styles.errorInput : undefined}
              onChangeText={handleMinChange}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInputUser
              placeholder="Metrekare (m2) max"
              value={createAdData.project.max}
              keyboardType="numeric"
              containerStyle={errors.max ? styles.errorInput : undefined}
              onChangeText={handleMaxChange}
            />
          </View>


          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Fiyat Bilgileri</Text>

            <TouchableOpacity onPress={() => setCurrencyModalVisible(true)}>
              <TextInputUser
                isModal={true}
                placeholder="Para birimi seç"
                value={createAdData.price.currency}
                editable={false}
                containerStyle={errors.currency ? styles.errorInput : undefined}
                onChangeText={() => {}}
              />
            </TouchableOpacity>
          </View>

          <Modal
            isVisible={currencyModalVisible}
            onBackdropPress={() => setCurrencyModalVisible(false)}
            style={styles.modal}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Para Birimi Seç</Text>

              {currenciesLoading && <ActivityIndicator color="#00A7C0" />}
              {currenciesError && (
                <Text style={styles.errorText}>{currenciesError}</Text>
              )}

              <FlatList
                data={currencies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleCurrencySelect(item.title, item.id)}
                  >
                    <Text>
                      {item.title} ({item.symbol})
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <Button
                title="İptal"
                onPress={() => setCurrencyModalVisible(false)}
                color="red"
              />
            </View>
          </Modal>

          {/* Fiyat Seçenekleri */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Fiyat Seçenekleri</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Aynı fiyat aralığındaki daireleri tek bir giriş altında
                tanımlayabilirsiniz.
              </Text>
            </View>

            {createAdData.project.priceOptions.map((value, index) => (
              <TextInputUser
                key={index}
                value={value}
                onChangeText={(text) => handleUpdatePriceOption(text, index)}
                placeholder={`${index + 1}. Fiyat Seçeneği`}
                containerStyle={styles.input}
              />
            ))}

            <TouchableOpacity
              onPress={handleAddPriceOption}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Yeni Fiyat Ekle</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader1}>Yetki Belgesi</Text>

          <FileInputRPicker
  label="."
  value={licenceFile}
  onChange={handleFileSelect}
  allowedTypes={["pdf", "image"]}
  maxFileSize={5}
  errorText={null} 
/>


            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Emlak firması olarak belirli sayıda bir daireyi satmak
                istiyorsanız yetki belgesini yüklemelisiniz.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDownloadPress}
              style={styles.downloadButton}
            >
              <Text style={styles.buttonText}>ŞABLON İNDİR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Apartman;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: {
    paddingBottom: 0,
  },
  section: { 
    marginTop: -2
  },
  sectionBlock: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginBottom: 1,
    marginTop: -1
    
  },
   sectionHeader1: {
    fontSize: 16,
    fontWeight: "800",
    color: "#25C5D1",
    marginBottom: 12,
    marginTop: -1
    
  },
  inputWrapper: {
    marginTop: 10,
  },
  errorInput: {
    borderWidth: 1.5,
    borderColor: "red",
    borderRadius: 8,
  },
  errorText: {
    color: "red",
  },
  modal: { 
    margin: 0, 
    justifyContent: "flex-end" 
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
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
  infoBox: {
    backgroundColor: "#fff4cd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    color: "#1b1a16",
  },
  addButton: {
    width: "100%",
    backgroundColor: "#25C5D1",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6.5,
    marginTop: 4,
  },
  downloadButton: {
    width: "100%",
    backgroundColor: "#ffca63",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },
  input: {
    width: "100%",
    marginBottom: 8,
  },
});