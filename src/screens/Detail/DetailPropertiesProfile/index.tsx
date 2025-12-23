import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { getAllProperties, getMyProperties } from "../../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { useNavigation } from "@react-navigation/native";
import FirstCard from "../../../components/Cards/FirstCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PropertiesScreenProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const { myList, loading } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(getMyProperties() as never);
  }, [dispatch]);

  const renderCard = ({ item }: any) => (
    <FirstCard
      title={item.title}
      updated_at={item.updated_at}
      image={item.cover}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
      company={item.company?.title}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() => navigation.navigate("PropertiesDetailScreen", { id: item.id })} videos={[]}    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!myList || myList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz ilan bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView  style={{ flex: 1, backgroundColor: "#fff" } } >

      <View style={styles.container}>
        <Text style={styles.header}>İlanlar</Text>
        <FlatList
          data={myList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default PropertiesScreenProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginTop: -47,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
    marginLeft: 4,
    
  },
  listContainer: {
    paddingBottom: 40,
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
});