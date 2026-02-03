import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import Modal from "react-native-modal";
import { useDispatch } from "react-redux";

import {
  getCustomer,
  getCurrency,
  getProperties,
  removeProperty,
  clearAllOfferData,
} from "../../../utils/offeresStorage";
import { AppDispatch } from "../../../redux/store";
import { createProposal } from "../../../../api";
import { ProfileButton } from "../../../components/Buttons/profileButton";
import SelectCustomerModal from "../../SelectCustomerModal";

const DEFAULT_IMAGE = "https://via.placeholder.com/100x100?text=No+Image";

const SelectedPropertiesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [customer, setCustomer] = useState<any>(null);
  const [currency, setCurrency] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(false);

   const [customerModalVisible, setCustomerModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [propertyCount, setPropertyCount] = useState(0);


const changeCustomerAlert = (onConfirm: () => void) => {
  Alert.alert(
    'Müşteri Değiştirilecek',
    'Müşteriyi değiştirdiğinizde tüm seçilen ilanlar silinecektir. Devam etmek istiyor musunuz?',
    [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Devam Et',
        onPress: onConfirm,
      },
    ]
  );
};
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
    useFocusEffect(
      useCallback(() => {
        const checkData = async () => {
          const customer = await getCustomer();
          const properties = await getProperties();
          setSelectedCustomer(customer);
          setPropertyCount(properties.length);
        };
        checkData();
      }, [])
    );
  
    const handleCustomerSelect = (code: string, name: string) => {
      console.log("Seçilen müşteri kodu:", code);
      console.log("Seçilen müşteri adı:", name);
    };


  const loadData = async () => {
    setLoading(true);
    const [customerData, currencyData, propertiesData] = await Promise.all([
      getCustomer(),
      getCurrency(),
      getProperties(),
    ]);
    setCustomer(customerData);
    setCurrency(currencyData);
    setProperties(propertiesData);
    setLoading(false);
  };

  const handleRemove = async (propertyId: number) => {
    Alert.alert(
      "İlanı Çıkar",
      "Bu ilanı listeden çıkarmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkar",
          style: "destructive",
          onPress: async () => {
            await removeProperty(propertyId);
            setProperties((prev) => prev.filter((p) => p.id !== propertyId));
          },
        },
      ]
    );
  };

  const handleOpenSendModal = () => {

  console.log(" Properties:", JSON.stringify(properties, null, 2));


    if (!customer) {
      Alert.alert("Hata", "Lütfen önce müşteri seçin");
      return;
    }
    if (properties.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir ilan ekleyin");
      return;
    }
    setSendModalVisible(true);
  };

  const handleSendOffers = async () => {
  console.log(" customer:", customer);
  console.log("currency:", currency);
  console.log("properties:", properties);

  setSending(true);

  try {
  const payload = {
  customer_id: customer.id,
  currency_id: currency?.code || "TRY",
  properties: properties.map((p) => ({
    id: p.id,
    price: p.offerPrice,
    title: p.title,
  })),
  notes: notes || undefined,
  notify: notify ? 1 : 0,
};


    console.log("Payload:", JSON.stringify(payload, null, 2));

    const result = await dispatch(createProposal(payload));

    console.log("🔹 API sonucu:", result);

    if (createProposal.fulfilled.match(result)) {
      await clearAllOfferData();
      setCustomer(null);
      setCurrency(null);
      setProperties([]);
      setNotes("");
      setSendModalVisible(false);

      Alert.alert("Başarılı", "Teklif başarıyla gönderildi", [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Hata", result.payload as string);
    }
  } catch (error) {
    console.log(" Error:", error);
    Alert.alert("Hata", "Teklif gönderilemedi");
  } finally {
    setSending(false);
  }
};

  const handleGoToProperty = (propertyId: number) => {
    navigation.navigate("PropertiesDetailScreen" as never, { id: propertyId } as never);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  const renderProperty = ({ item }: { item: any }) => (
    <View style={styles.propertyCard}>
      <Image
        source={{ uri: item.cover || DEFAULT_IMAGE }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.propertyType}>
          {item.type || "Apartman"} / {item.status || "Hazır"}
        </Text>
        <Text style={styles.propertyCode}>{item.code || ""}</Text>
        <Text style={styles.propertyPrice}>
          {item.price || `₺${item.offerPrice?.toLocaleString("tr-TR")}`}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleGoToProperty(item.id)}
        >
          <Ionicons name="open-outline" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleRemove(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
   
  );

  return (
    <View style={styles.container}>

      <View style={styles.customerSection}>
        <View>
          <Text style={styles.customerLabel}>Seçilen Müşteri:</Text>
          <Text style={styles.customerName}>{customer?.name || "Seçilmedi"}</Text>
        </View>
        <View>
          <ProfileButton
            bg="#c4c4c4"
            height={45}
            width={125}
            color="white"
            label="Müşteriyi değiştir"
            onPress={() => changeCustomerAlert(() => {
              setCustomer(null);
              setProperties([]);
              clearAllOfferData();
              navigation.goBack();
            })} marginTop={0}/>

        </View>
      </View>

     
      <Text style={styles.sectionTitle}>Teklif için seçtiğiniz ilanlar</Text>
       <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!customer || properties.length === 0) && styles.nextButtonDisabled,
          ]}
          onPress={handleOpenSendModal}
        >
          <Text style={styles.nextButtonText}>İlerle</Text>
        </TouchableOpacity>
      </View>


      {properties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="home-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Henüz ilan eklenmedi</Text>
          <Text style={styles.emptySubText}>
            İlan detay sayfasından "+" butonuna basarak ilan ekleyebilirsiniz
          </Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProperty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* İlerle Butonu */}
     

      {/* Gönderim Modal */}
      <Modal
        isVisible={sendModalVisible}
        onBackdropPress={() => setSendModalVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.sendModalContent}>
          <Text style={styles.sendModalTitle}>Teklif Gönder</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Müşteri:</Text>
            <Text style={styles.summaryValue}>{customer?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
           <ProfileButton  
           bg="#c4c4c4" height={23} label={"Müşteriyi değiştir"} marginTop={0} /> 
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>İlan Sayısı:</Text>
            <Text style={styles.summaryValue}>{properties.length}</Text>
          </View>

          <Text style={styles.inputLabel}>Not (opsiyonel)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Müşteriye not ekleyin..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <TouchableOpacity
            style={styles.notifyRow}
            onPress={() => setNotify(!notify)}
          >
            <Ionicons
              name={notify ? "checkbox" : "square-outline"}
              size={24}
              color="#25C5D1"
            />
            <Text style={styles.notifyText}>Müşteriye bildirim gönder</Text>
          </TouchableOpacity>

          <ProfileButton
            label={sending ? "Gönderiliyor..." : "Teklif Gönder"}
            bg="#25C5D1"
            color="#fff"
            height={48}
            marginTop={16}
            onPress={handleSendOffers}
          />

          <ProfileButton
            label="İptal"
            bg="#c4c4c4"
            color="#fff"
            height={48}
            marginTop={0}
            onPress={() => setSendModalVisible(false)}
          />
        </View>
      </Modal>

        <SelectCustomerModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
       onSelect={handleCustomerSelect}
      />
    </View>

    
  );
};

export default SelectedPropertiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  customerLabel: {
    fontSize: 12,
    color: "#999",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25C5D1",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  propertyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  propertyCode: {
    fontSize: 11,
    color: "#bbb",
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#25C5D1",
  },
  actionButtons: {
    justifyContent: "flex-start",
    gap: 8,
    flexDirection: 'row'
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#E53935",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 13,
    color: "#bbb",
    textAlign: "center",
    marginTop: 8,
  },
  bottomButtons: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nextButton: {
    backgroundColor: "#25C5D1",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sendModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sendModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#25C5D1",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  inputLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
  },
  notifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  notifyText: {
    fontSize: 14,
    color: "#333",
  },
});