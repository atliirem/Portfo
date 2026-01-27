import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";

import { AppDispatch, RootState } from "../../../redux/store";
import { getProposalDetail } from "../../../../api";

const FALLBACK_IMAGE =
  "https://portfoy.demo.pigasoft.com/default-property-image.jpg";

export const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { id, code } = route.params;

  const [activeTab, setActiveTab] = useState<"detail" | "rating">("detail");

  const offerLink = `https://port-foy.com/pr/${code}`;

  const { proposalDetail, loadingProposalDetail } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    dispatch(getProposalDetail(id));
  }, [dispatch, id]);

  const proposal = proposalDetail;
  const customer = proposal?.customer;
  const notes = proposal?.notes;
  const score = proposal?.score;
  const expiry_at = proposal?.expiry_at;
  const properties = proposal?.properties || [];

  const handleWhatsAppShare = () => {
    const message = `Teklif detaylarını inceleyebilirsiniz: ${offerLink}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Hata", "WhatsApp açılamadı");
    });
  };

  const handleCopyLink = () => {
    Clipboard.setString(offerLink);
    Alert.alert("Başarılı", "Bağlantı kopyalandı");
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handlePropertyPress = (propertyId: number) => {
    navigation.navigate("PropertiesDetailScreen", { id: propertyId });
  };

  if (loadingProposalDetail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  if (!proposal) {
    return (
      <View style={styles.center}>
        <Text>Teklif bulunamadı</Text>
      </View>
    );
  }

  const renderPropertyCard = ({ item }: { item: any }) => {
    const imageUri =
      item.cover && typeof item.cover === "string" && item.cover.startsWith("http")
        ? item.cover
        : FALLBACK_IMAGE;

    return (
      <TouchableOpacity
        style={styles.propertyCard}
        activeOpacity={0.8}
        onPress={() => handlePropertyPress(item.id)}
      >
        <View style={styles.propertyContent}>
          <Image
            source={{ uri: imageUri }}
            style={styles.propertyImage}
            resizeMode="cover"
          />

          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {item.title}
            </Text>

            {(item.street?.title || item.district?.title || item.city?.title) && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color="#999" />
                <Text style={styles.infoText} numberOfLines={2}>
                  {[item.street?.title, item.district?.title, item.city?.title]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            )}

            {item.status?.title && (
              <View style={styles.infoRow}>
                <Ionicons name="grid-outline" size={14} color="#999" />
                <Text style={styles.infoText}>{item.status.title}</Text>
              </View>
            )}

            {item.type?.title && (
              <View style={styles.infoRow}>
                <Ionicons name="menu-outline" size={14} color="#999" />
                <Text style={styles.infoText}>{item.type.title}</Text>
              </View>
            )}

            {item.company?.title && (
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={14} color="#999" />
                <Text style={styles.infoText}>{item.company.title}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Satış Fiyatı</Text>
            <Text style={styles.priceValue}>
              {item.price?.formatted || item.prices?.primary?.formatted || "—"}
            </Text>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Teklif Edilen Tutar</Text>
            <Text style={styles.priceValue}>
              {item.price?.formatted || item.prices?.primary?.formatted || "—"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailContent = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.code}>Teklif Kodu: {code}</Text>
      {expiry_at && <Text style={styles.expiry}>{expiry_at} tarihinde sonlanacak</Text>}

      {customer && (
        <View style={styles.companyCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customer.name?.charAt(0)}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.companyName}>{customer.name}</Text>
            <Text style={styles.companyEmail}>{customer.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleCall(customer.phone)}
          >
            <Ionicons name="call-outline" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleEmail(customer.email)}
          >
            <Ionicons name="mail-outline" size={20} />
          </TouchableOpacity>
        </View>
      )}

      {notes && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notunuz (Müşteri için)</Text>
          <Text style={styles.cardText}>{notes}</Text>
        </View>
      )}

      {score ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Score</Text>
          <Text style={styles.cardText}>{score}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="chatbox" size={32} color="#c4c4c4" />
          </View>
          <Text style={styles.emptyText}>Henüz değerlendirilmedi</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.shareTitle}>Bu teklifi paylaş:</Text>

        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppShare}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={styles.whatsappText}>Whatsapp'ta paylaş</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink}>
          <Ionicons name="link-outline" size={18} />
          <Text style={styles.copyText}>Bağlantıyı kopyala</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentButton, activeTab === "detail" && styles.segmentActive]}
          onPress={() => setActiveTab("detail")}
        >
          <Text style={[styles.segmentText, activeTab === "detail" && styles.segmentTextActive]}>
            Teklif Detayı
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentButton, activeTab === "rating" && styles.segmentActive]}
          onPress={() => setActiveTab("rating")}
        >
          <Text style={[styles.segmentText, activeTab === "rating" && styles.segmentTextActive]}>
            Değerlendirme
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {activeTab === "detail" && renderDetailContent()}

        {activeTab === "rating" && (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.propertiesList}
            showsVerticalScrollIndicator={false}
            renderItem={renderPropertyCard}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="home-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Henüz ilan eklenmemiş</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#fff", 
    marginTop: -75,
    paddingBottom: 30,
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderRadius: 16,
    padding: 4,
    margin: 27
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  segmentActive: { 
    backgroundColor: "#fff" 
  },
  segmentText: { 
    color: "#9E9E9E", 
    fontWeight: "600" 
  },
  segmentTextActive: { 
    color: "#000", 
    fontWeight: "700" 
  },

  container: { 
    flex: 1, 
    paddingHorizontal: 16 
  },

  // ScrollView Layout
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  code: { 
    fontSize: 16, 
    fontWeight: "700" 
  },
  expiry: { 
    color: "#999", 
    marginBottom: 12 
  },

  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 12,
    marginVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#25C5D1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 18 
  },
  customerInfo: {
    flex: 1,
  },
  companyName: { 
    fontWeight: "700" 
  },
  companyEmail: { 
    color: "#888", 
    fontSize: 13 
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFD36A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  card: {
    backgroundColor: "#F6F7F8",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },

  cardTitle: { 
    fontWeight: "600", 
    marginBottom: 6 
  },
  cardText: { 
    color: "#333", 
    lineHeight: 20 
  },

  shareTitle: { 
    textAlign: "center", 
    color: "#999", 
    marginBottom: 12 
  },

  whatsappBtn: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  whatsappText: { 
    color: "#fff", 
    fontWeight: "700", 
    marginLeft: 8 
  },

  copyBtn: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaebec",
    paddingVertical: 14,
    borderRadius: 12,
  },
  copyText: { 
    marginLeft: 6, 
    fontWeight: "600" 
  },

  // Properties List
  propertiesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },

  // Property Card
  propertyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyContent: {
    flexDirection: "row",
  },
  propertyImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  priceBox: {
    flex: 1,
    alignItems: "flex-start",
  },
  priceLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F9C43E",
  },
  priceValueOrange: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF8C00",
  },
});