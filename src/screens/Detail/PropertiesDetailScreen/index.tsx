import React, { useCallback, useState, useEffect } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import BannerPhoto from "../../../components/Banner/BannerPhoto";
import PropertiesButton from "../../../components/Buttons/PropertiesButton";
import MyPropertiesButton from "../../../components/Buttons/MyPropertiesButton";
import { BannerDetail } from "../../../components/Banner/BannerDetail";
import MapOrVideos from "../../MapOrVideos";
import { getAllCompanies, getProperties } from "../../../../api";
import {
  setDetailFeatures,
  setDetailLoading,
  clearDetailFeatures,
} from "../../../redux/Slice/featureSlice";

type Props = NativeStackScreenProps<RootStackParamList, "PropertiesDetailScreen">;

const PropertiesDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();

  const { discountedList, latestList, myList, property, loading } = useSelector(
    (state: RootState) => state.properties
  );

  const { user } = useSelector((state: RootState) => state.auth);
  const { company } = useSelector((state: RootState) => state.company);

  const [retryCount, setRetryCount] = useState(0);
  const [fetchedProperty, setFetchedProperty] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        dispatch(setDetailLoading(true));

        try {
          const result = await dispatch(getProperties(id)).unwrap();
          
          if (result) {
            setFetchedProperty(result);
          }

          if (result?.features && Array.isArray(result.features)) {
            dispatch(
              setDetailFeatures({
                propertyId: id,
                features: result.features,
              })
            );
          }
        } catch (error: any) {
          console.error("Property fetch error:", error);
          if (error?.includes?.("Too Many") || error?.includes?.("429")) {
            if (retryCount < 3) {
              setTimeout(() => setRetryCount((prev) => prev + 1), 3000);
            }
          }
        }
      };

      fetchData();

      return () => {
        dispatch(clearDetailFeatures());
        setFetchedProperty(null);
      };
    }, [id, dispatch, retryCount])
  );

  const handleCompanyPress = (companyId: number) => {
    navigation.navigate("CompanyDetailScreen", { id: companyId });
  };

  const previewItem =
    myList.find((p) => p.id === id) ||
    discountedList.find((p) => p.id === id) ||
    latestList.find((p) => p.id === id);

  const detailItem = property && property.id === id ? property : null;
  const displayItem = fetchedProperty || detailItem || previewItem;

  const isDraft = displayItem?.status === "draft";

  const isMyProperty = (() => {
    if (!displayItem?.company?.id) return false;
    
    if (company?.id && displayItem.company.id === company.id) {
      return true;
    }
    
    const userCompanyId = user?.roles?.[0]?.company_id;
    if (userCompanyId && displayItem.company.id === userCompanyId) {
      return true;
    }
    
    if (myList.some((p) => p.id === id)) {
      return true;
    }
    
    return false;
  })();

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
            {isMyProperty ? (
              <MyPropertiesButton item={displayItem} />
            ) : (
              <PropertiesButton item={displayItem} />
            )}
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>{displayItem.title}</Text>

          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <Ionicons name="location-outline" color="#C4C4C4" size={15} />
              <Text style={styles.locationText}>
                {displayItem.city?.title} / {displayItem.district?.title}
              </Text>
            </View>

            {displayItem.updated_at && (
              <View style={styles.locationItem}>
                <Ionicons name="time-outline" color="#C4C4C4" size={15} />
                <Text style={styles.dateText}>{displayItem.updated_at}</Text>
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
                {displayItem.prices?.secondary?.formatted || "-"}
              </Text>
              <Text style={styles.price}>
                {displayItem.prices?.primary?.formatted || "-"}
              </Text>
            </View>
          </View>

          {isDraft && (
            <View style={styles.draftInfoBox}>
              <Text style={styles.draftInfoText}>
                Bu ilan taslak durumunda olduğu için özellikler görüntülenmiyor.
                İlanı yayınladıktan sonra tüm özellikler görünür olacaktır.
              </Text>
            </View>
          )}

          <BannerDetail id={id} isDraft={isDraft} />

          {displayItem?.map && (
            <MapOrVideos
              locationData={displayItem.map}
              videoUrl={displayItem.video_url}
              editable={false}
            />
          )}

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
        </View>
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
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
    marginTop: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#C4C4C4",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 4,
  },
  dateText: {
    color: "#C4C4C4",
    marginLeft: 5,
    fontSize: 14,
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
  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
    marginTop: -65,
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
  draftInfoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff4ce",
    padding: 12,
    borderRadius: 8,
    marginTop: 0,
    gap: 8,
  },
  draftInfoText: {
    flex: 1,
    fontSize: 13,
    color: "#bd8827",
    lineHeight: 18,
    justifyContent: 'center',
    textAlign: 'center',
  },
});