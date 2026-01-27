import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWishlist, toggleWishlist } from "../../../api";
import { useFocusEffect } from "@react-navigation/native";
import FirstCard from "../../components/Cards/FirstCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import Ionicons from "@react-native-vector-icons/ionicons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Favorite: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const { favlist, loading } = useSelector(
    (state: RootState) => state.properties
  );

  const [clearLoading, setClearLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(getWishlist() as never);
    }, [dispatch])
  );

  const handleRefresh = () => {
    dispatch(getWishlist() as never);
  };

  const handleClearWishlist = () => {
    if (!favlist || favlist.length === 0) {
      Alert.alert("Uyarı", "Favori listeniz zaten boş.");
      return;
    }

    Alert.alert(
      "Favorileri Temizle",
      `${favlist.length} favoriyi silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Temizle",
          style: "destructive",
          onPress: async () => {
            setClearLoading(true);
            try {
             
              for (const item of favlist) {
                await dispatch(toggleWishlist(item.id)).unwrap();
              }
              
       
              await dispatch(getWishlist());
              Alert.alert("Başarılı", "Tüm favoriler temizlendi.");
            } catch (error: any) {
              Alert.alert("Hata", "Favoriler temizlenirken bir hata oluştu.");
      
              dispatch(getWishlist());
            } finally {
              setClearLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading && !clearLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );
  }

  if (!favlist || favlist.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>Favorilerim</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Henüz favori ilan yok</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderCard = ({ item }: { item: any }) => (
    <FirstCard
      title={item.title}
      image={item.cover}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
      company={item.company?.title}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() =>
        navigation.navigate("PropertiesDetailScreen", { id: item.id })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Favorilerim</Text>
          <TouchableOpacity
            onPress={handleClearWishlist}
            disabled={clearLoading}
          >
            {clearLoading ? (
              <ActivityIndicator size="small" color="#00A7C0" />
            ) : (
              <Text style={styles.clean}>Temizle</Text>
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={favlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor="#00A7C0"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00A7C0",
    marginVertical: 12,
  },
  clean: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00A7C0",
    marginVertical: 12,
    marginRight: 12,
    textDecorationLine: "underline",
  },
  listContainer: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
