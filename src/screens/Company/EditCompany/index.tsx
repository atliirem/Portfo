import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native"; 
import { pick } from "@react-native-documents/picker";

import type { RootState, AppDispatch } from "../../../redux/store";
import {
  getCompany,
  SelectedFile,
  updateCompanyProfileThunk,
  uploadCompanyLogoThunk,
} from "../../../../api";

import TextInputR from "../../../components/TextInput/TextInputR";
import FilePicker from "../../../components/UploadFile/FileUploadExample";
import SelectedFilesModal from "../../../components/UploadFile/SelectedFileModal";

const EditCompanyScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation(); 
  const { company, loading, error } = useSelector((s: RootState) => s.company);

  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [tradeName, setTradeName] = useState("");
  const [taxOffice, setTaxOffice] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [taxPlateFile, setTaxPlateFile] = useState<SelectedFile | null>(null);
  const [licenceFile, setLicenceFile] = useState<SelectedFile | null>(null);

  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [filesModalFile, setFilesModalFile] = useState<SelectedFile | null>(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!company) return;

    const profile: any = (company as any)?.profile;

    setCompanyName((company as any)?.name ?? profile?.name ?? "");
    setWebsite((company as any)?.website ?? profile?.website ?? "");
    setCompanyType((company as any)?.type ?? profile?.type ?? "");
    setTaxNumber(profile?.tax_number ?? "");
    setLicenceNumber(profile?.licence_number ?? profile?.licance_number ?? "");
    setEmail(profile?.email ?? (company as any)?.email ?? "");
    setPhoneCode(profile?.phone?.code ?? "");
    setPhone(profile?.phone?.number ?? (company as any)?.phone ?? "");

    setTradeName(profile?.billing?.trade_name ?? "");
    setTaxOffice(profile?.billing?.tax_office ?? "");
    setCompanyAddress(profile?.billing?.address ?? "");
  }, [company]);

  const logoUrl = useMemo(() => {
    const base = (company as any)?.logo;
    if (!base) return undefined;
    const bust = Date.now();
    return `${base}${base.includes("?") ? "&" : "?"}v=${bust}`;
  }, [(company as any)?.logo]);

  const clean = (v: string) => (v ?? "").trim();
  const digits = (v: string) => (v ?? "").replace(/\D/g, "");

  const openFilesModal = (file: SelectedFile | null) => {
    setFilesModalFile(file);
    setFilesModalVisible(true);
  };

  const pickAndUploadLogo = async () => {
    try {
      if (uploadingLogo) return;

      setUploadingLogo(true);

      const result = await pick();
      const file: any = Array.isArray(result) ? result[0] : result;
      if (!file?.uri && !file?.fileCopyUri) return;

      const selected: SelectedFile = {
        uri: file.fileCopyUri || file.uri,
        name: file.name || file.fileName || "logo.jpg",
        type: file.type || file.mimeType || "image/jpeg",
        size: file.size || file.fileSize,
      };

      await dispatch(uploadCompanyLogoThunk({ logo: selected }))
        .unwrap()
        .then(() => {
          dispatch(getCompany());
          Alert.alert("Başarılı", "Logo güncellendi");
        })
        .catch((e) => {
          throw new Error(e || "Logo yüklenemedi");
        });
    } catch (e: any) {
      const msg = (e?.message || "").toLowerCase();
      const code = (e?.code || "").toLowerCase();
      if (msg.includes("cancel") || code.includes("cancel")) return;
      Alert.alert("Hata", e?.message || "Logo seçilemedi");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = () => {
    if (!clean(companyName)) return Alert.alert("Hata", "Firma adı gerekli");
    if (!clean(taxNumber)) return Alert.alert("Hata", "Vergi numarası gerekli");
    if (!clean(licenceNumber)) return Alert.alert("Hata", "Lisans numarası gerekli");
    if (!clean(email)) return Alert.alert("Hata", "E-posta gerekli");
    if (!digits(phoneCode)) return Alert.alert("Hata", "Telefon kodu gerekli");
    if (!clean(phone)) return Alert.alert("Hata", "Telefon gerekli");
    if (!clean(tradeName)) return Alert.alert("Hata", "Ticari Ünvan gerekli");
    if (!clean(taxOffice)) return Alert.alert("Hata", "Vergi Dairesi gerekli");
    if (!clean(companyAddress)) return Alert.alert("Hata", "Firma adresi gerekli");

    dispatch(
      updateCompanyProfileThunk({
        company_name: clean(companyName),
        tax_number: clean(taxNumber),
        licence_number: clean(licenceNumber),
        email: clean(email),
        phone: clean(phone),
        phone_code: digits(phoneCode),

        billing_trade_name: clean(tradeName),
        billing_tax_office: clean(taxOffice),
        billing_company_address: clean(companyAddress),

        tax_plate_uri: taxPlateFile?.uri,
        licence_file_uri: licenceFile?.uri,
      } as any)
    )
      .unwrap()
      .then(() => {
        dispatch(getCompany());
      
        Alert.alert("Başarılı", "Firma güncellendi", [
          {
            text: "Tamam",
            onPress: () => navigation.goBack(),
          },
        ]);
      })
      .catch((e) => Alert.alert("Hata", e || "Firma güncellenemedi"));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Image
                source={{
                  uri:
                    logoUrl ||
                    "https://ui-avatars.com/api/?name=Logo&background=27c5d2&color=fff&size=128",
                }}
                style={styles.logoImg}
              />
            </View>

            <Pressable
              onPress={pickAndUploadLogo}
              style={[styles.editBtn, uploadingLogo && styles.editBtnDisabled]}
              hitSlop={12}
              disabled={uploadingLogo}
            >
              {uploadingLogo ? (
                <ActivityIndicator color="#111827" />
              ) : (
                <Text style={styles.editIcon}>✎</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.header}>Firma Profilini Düzenle</Text>

          <TextInputR label="Firma Adı" value={companyName} onChangeText={setCompanyName} />

          <TextInputR
            value={companyType}
            onChangeText={setCompanyType}
            disabled
            containerStyle={styles.disabledInput}
          />

          <FilePicker
            label="Vergi Levhası (PDF)"
            value={taxPlateFile}
            onFileSelect={setTaxPlateFile}
            allowedTypes={["pdf"]}
            maxFileSize={10}
            placeholder={taxPlateFile ? "1 dosya seçildi" : "Dosya seç"}
          />

          {taxPlateFile ? (
            <TouchableOpacity onPress={() => openFilesModal(taxPlateFile)} style={styles.viewFilesBtn}>
              <Text style={styles.viewFilesText}>Dosyaları Görüntüle (1 Dosya)</Text>
            </TouchableOpacity>
          ) : null}

          <TextInputR
            label="Vergi Numarası"
            value={taxNumber}
            onChangeText={setTaxNumber}
            keyboardType="number-pad"
          />

          <FilePicker
            label="Ticaret Odası Faaliyet Belgesi (PDF)"
            value={licenceFile}
            onFileSelect={setLicenceFile}
            allowedTypes={["pdf"]}
            maxFileSize={10}
            placeholder={licenceFile ? "1 dosya seçildi" : "Dosya seç"}
          />

          {licenceFile ? (
            <TouchableOpacity onPress={() => openFilesModal(licenceFile)} style={styles.viewFilesBtn}>
              <Text style={styles.viewFilesText}>Dosyaları Görüntüle (1 Dosya)</Text>
            </TouchableOpacity>
          ) : null}

          <TextInputR
            label="Mersis Numarası"
            value={licenceNumber}
            onChangeText={setLicenceNumber}
          />

          <Text style={styles.subHeader}>İletişim Bilgileri </Text>

          <TextInputR
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <TextInputR
              containerStyle={styles.codeInput}
              label="Kod"
              value={phoneCode}
              onChangeText={setPhoneCode}
              keyboardType="number-pad"
            />
            <TextInputR
              containerStyle={styles.flex1}
              label="Telefon"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TextInputR
            containerStyle={styles.flex1}
            label="Website"
            value={website}
            onChangeText={setWebsite}
            keyboardType="email-address"
          />

          <Text style={styles.subHeader}>Fatura Bilgileri</Text>

          <TextInputR label="Ticari Ünvan" value={tradeName} onChangeText={setTradeName} />
          <TextInputR label="Vergi Dairesi" value={taxOffice} onChangeText={setTaxOffice} />

          <TextInputR
            label="Firma Adresi"
            multiline
            value={companyAddress}
            onChangeText={setCompanyAddress}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledBtn]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{loading ? "Kaydediliyor..." : "Kaydet"}</Text>
          </TouchableOpacity>

          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <SelectedFilesModal
          visible={filesModalVisible}
          onClose={() => setFilesModalVisible(false)}
          file={filesModalFile}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditCompanyScreen;



const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" , marginTop: -50},
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 65 },

  logoWrap: { alignItems: "center", marginBottom: 12, marginTop: 6 },
  logoCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: -20
  },
  logoImg: { width: 85, height: 85, borderRadius: 67.5 },

  editBtn: {
    position: "absolute",
    right: 136,
    top: 26,
    width: 22,
    height: 22,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  editBtnDisabled: { opacity: 0.6 },
  editIcon: { fontSize: 18, color: "#111827" },

  header: { fontSize: 16, fontWeight: "700", color: "#19A7B6", marginBottom: 18 },
  subHeader: { fontSize: 16, fontWeight: "700", color: "#19A7B6", marginTop: 14, marginBottom: 10 },

  row: { flexDirection: "row", gap: 12 },
  codeInput: { width: 100 },
  flex1: { flex: 1 },
  addressInput: { height: 110, alignItems: "flex-start" , width: '100%'},
  disabledInput: { opacity: 0.6 },

  viewFilesBtn: { marginTop: -6, marginBottom: 14, alignSelf: "center" },
  viewFilesText: { color: "#19A7B6", fontSize: 12, fontWeight: "700" , textAlign: 'right', alignSelf: 'flex-end', right: -89},

  button: {
    marginTop: 18,
    backgroundColor: "#1a8b95",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  error: { marginTop: 10, color: "red" },
});
