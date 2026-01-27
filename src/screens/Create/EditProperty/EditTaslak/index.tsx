// EditTaslak.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert, ActivityIndicator, Text } from "react-native";
import { ComponentButton } from "../../../../components/Buttons/componentsButton";
import { useAppSelector, useAppDispatch } from "../../../../redux/Hooks";
import { useRoute, RouteProp } from "@react-navigation/native";
import TaslakInfo from "../../Components/TaslakInfo";
import PropertyMap from "../../../../components/MapComponents";
import EditProperty from "../../../Edit/EditProperty";
import SettingsScreen from "../SettingsScreen";
import GalleryScreen from "../../../GalleryScreen";
import { updatePropertyLocation, getProperties } from "../../../../../api";
import { loadPropertyToForm } from "../../../../redux/Slice/formSlice";
import { setFormFeatures, setFormLoading, clearFormFeatures } from "../../../../redux/Slice/featureSlice";

interface MapOrVideosProps {
  locationData?: { latitude: string; longitude: string } | null | undefined;
  videoUrl?: string | null;
  propertyId?: number;
}

type RouteParams = {
  EditTaslak: { propertyId?: number; id?: number };
};

export default function EditTaslak({ locationData: propLocationData, propertyId: propId }: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState("Property");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [locationData, setLocationData] = useState(propLocationData || null);

  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RouteParams, "EditTaslak">>();

  const { property } = useAppSelector((state) => state.properties);
  const { myList } = useAppSelector((state) => state.properties);
  const { propertyId: formPropertyId } = useAppSelector((state) => state.form);

  const propertyId =
    propId ||
    route.params?.propertyId ||
    route.params?.id ||
    property?.id ||
    formPropertyId ||
    0;

  const tabs = [
    { key: "Property", label: "İlan" },
    { key: "Location", label: "Konum" },
    { key: "Gallery", label: "Galeri" },
    { key: "Hareketler", label: "Haraketler" },
    { key: "Settings", label: "Ayarlar" },
  ];

  useEffect(() => {
    if (propertyId) loadPropertyData();

    return () => {
      dispatch(clearFormFeatures());
    };
  }, [propertyId]);

  const loadPropertyData = async () => {
    if (!propertyId) return;

    setIsLoadingData(true);
    dispatch(setFormLoading(true));

    try {
      const propertyData = await dispatch(getProperties(propertyId)).unwrap();

      if (!propertyData || !propertyData.id) {
        Alert.alert("Hata", "İlan bulunamadı.");
        return;
      }


      if (propertyData.map?.latitude && propertyData.map?.longitude) {
        setLocationData({
          latitude: String(propertyData.map.latitude),
          longitude: String(propertyData.map.longitude),
        });
      }


      dispatch(loadPropertyToForm(propertyData));


      if (Array.isArray(propertyData.features) && propertyData.features.length > 0) {
        dispatch(setFormFeatures({ propertyId, features: propertyData.features }));
      } else {
        dispatch(setFormFeatures({ propertyId, features: [] }));
      }

    } catch (e) {
      console.error("loadPropertyData error:", e);

      const listItem = myList.find((p) => p.id === propertyId);
      if (listItem) {
        dispatch(loadPropertyToForm(listItem));

        if (listItem.map?.latitude && listItem.map?.longitude) {
          setLocationData({
            latitude: String(listItem.map.latitude),
            longitude: String(listItem.map.longitude),
          });
        }

        dispatch(setFormFeatures({ propertyId, features: listItem.features || [] }));
      } else {
        Alert.alert("Hata", "İlan verileri yüklenemedi.");
      }
    } finally {
      setIsLoadingData(false);
      dispatch(setFormLoading(false));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    if (!propertyId) {
      Alert.alert("Hata", "İlan ID bulunamadı");
      return;
    }

    dispatch(
      updatePropertyLocation({
        propertyId,
        latitude: lat,
        longitude: lng,
      })
    )
      .unwrap()
      .then(() => {
        Alert.alert("Başarılı", "Konum güncellendi");
        setLocationData({ latitude: String(lat), longitude: String(lng) });
      })
      .catch((err) => {
        Alert.alert("Hata", err || "Konum güncellenemedi");
      });
  };

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={113}
      marginTop={4}
      onPress={() => setActiveTab(item.key)}
    />
  );

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
        <Text style={styles.loadingText}>İlan verileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <TaslakInfo propertyId={propertyId} />

      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          data={tabs}
          renderItem={renderButton}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonContainer}
        />
      </View>

      <View style={styles.content}>
        <View style={[styles.tabContent, { display: activeTab === "Property" ? "flex" : "none" }]}>
          <EditProperty />
        </View>

        <View style={[styles.tabContent, { display: activeTab === "Location" ? "flex" : "none" }]}>
          <View style={styles.mapContainer}>
            <PropertyMap location={locationData} editable={true} onLocationChange={handleLocationChange} />
          </View>
        </View>

        <View style={[styles.tabContent, { display: activeTab === "Gallery" ? "flex" : "none" }]}>
          <GalleryScreen propertyId={propertyId} />
        </View>

        <View style={[styles.tabContent, { display: activeTab === "Hareketler" ? "flex" : "none" }]}>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.tabContent, { display: activeTab === "Settings" ? "flex" : "none" }]}>
          <SettingsScreen propertyId={propertyId} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  tabsWrapper: { backgroundColor: "#fff", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  buttonContainer: { paddingHorizontal: 10, gap: 8 },
  content: { flex: 1, backgroundColor: "#f9f9f9" },
  tabContent: { flex: 1 },
  mapContainer: { flex: 1, padding: 16 },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
});