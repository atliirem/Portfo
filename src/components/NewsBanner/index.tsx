// src/components/Banners/NewsBanner.tsx
import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../../../api";
import { AppDispatch, RootState } from "../../redux/store";
import NewsCard from "../Cards/NewsCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const { width } = Dimensions.get("window");

const NewsBanner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newsList } = useSelector((state: RootState) => state.properties);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  if (!newsList || newsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz haber yok</Text>
      </View>
    );
  }

  const renderCard = ({ item }) => (
    <NewsCard
      id={item.id}
      title={item.title}
      image={item.cover}
      created_at={item.created_at}
      onPress={() => navigation.navigate("NewsDetailScreen", { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Haberler ve Duyurular</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewsListScreen" )}
        >
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={newsList}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default NewsBanner;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 4,
    marginLeft: -17,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  header: {
    fontWeight: "800",
    fontSize: 18,
    color: "#000",
    marginLeft: 19,
  },
  seeAll: {
    color: "#777",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    marginBottom: 50,
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
});
