import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../../redux/Hooks";
import Ionicons from "@react-native-vector-icons/ionicons";

import BannerPhoto from "../../../components/Banner/BannerPhoto";
import PropertiesButton from "../../../components/Buttons/PropertiesButton";
import { BannerDetail } from "../../../components/Banner/BannerDetail";
import MapOrVideos from "../../MapOrVideos";
import { getAllCompanies, getProperties } from "../../../../api";

type Props = NativeStackScreenProps<RootStackParamList, "PropertiesDetailScreen">;

const PropertiesDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { discountedList, latestList, property, loading } = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProperties(id));
  }, [id]);

  const handleCompanyPress = (companyId: number) => {
    navigation.navigate("CompanyDetailScreen", { id: companyId });
  };

  const previewItem =
    discountedList.find((p) => p.id === id) || latestList.find((p) => p.id === id);

  const detailItem = property && property.id === id ? property : null;

  const displayItem = detailItem || previewItem;

  if (!displayItem) {
    return (
      <View style={styles.center}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a8b95" />
        ) : (
          <Text style={styles.emptyText}>İlan bulunamadı</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <BannerPhoto id={id} />
          <View style={styles.iconContainer}>
            <PropertiesButton item={displayItem} />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{displayItem.title}</Text>

          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="location-outline" color="#C4C4C4" size={15} />
              <Text style={styles.location}>
                {displayItem.city?.title} / {displayItem.district?.title}
              </Text>
            </View>

            {displayItem.updated_at && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="time-outline" color="#C4C4C4" size={15} />
                <Text style={{ color: "#C4C4C4", marginLeft: 5, fontSize: 14 }}>
                  {displayItem.updated_at}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceHeaderRow}>
              <Text style={styles.priceLabel}>Pass Fiyatı</Text>
              <Text style={styles.priceLabel}>Satış Fiyatı</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {displayItem.prices?.secondary.formatted}
              </Text>
              <Text style={styles.price}>
                {displayItem.prices?.primary.formatted}
              </Text>
            </View>
          </View>

          <BannerDetail id={id} />
        </View>

        <View>
          {detailItem ? (
            <MapOrVideos locationData={detailItem.map} />
          ) : loading ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="small" color="#1a8b95" />
              <Text style={styles.mapLoadingText}>Harita yükleniyor...</Text>
            </View>
          ) : null}
        </View>


        {displayItem.company && (
          <TouchableOpacity
            style={styles.companyCard}
            onPress={() => handleCompanyPress(displayItem.company.id)}
          >
            <Image
              style={styles.companyLogo}
              source={{ uri: displayItem.company.logo }}
            />
            <View style={styles.companyInfo}>
              <Text style={styles.companyLabel}>İlan Sahibi</Text>
              <Text style={styles.companyTitle}>{displayItem.company.title}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#a9a9a9" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertiesDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingBottom: 65,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  iconContainer: {
    position: "absolute",
    top: -10,
    left: -18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
    marginTop: 40,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F9C43E",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  location: {
    color: "#C4C4C4",
    fontSize: 15,
    fontWeight: "500",
  },
  mapLoading: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  mapLoadingText: {
    color: "#999",
    marginTop: 10,
  },
  // Firma Kartı
  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 6,
    padding: 12,
    margin: 10,
  },
  companyLogo: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  companyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  companyLabel: {
    color: "#AFAFAF",
    fontSize: 12,
  },
  companyTitle: {
    color: "#000",
    fontWeight: "500",
    fontSize: 15,
    marginTop: 2,
  },
});