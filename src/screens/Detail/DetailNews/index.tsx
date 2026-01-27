import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import NewsCard from "../../../components/Cards/NewsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NewsListScreen: React.FC = () => {
  const { newsList } = useSelector((state: RootState) => state.properties);
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }) => (
    <NewsCard
    city={item.id}
      id={item.id}
      title={item.title}
      image={item.cover}
      created_at={item.created_at}
      horizontal={true} 
      onPress={() => navigation.navigate("NewsDetailScreen", { id: item.id } )}
    />
  );

  if (!newsList || newsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz haber bulunamadı</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Haberler ve Duyurular</Text>
        
        <FlatList
          data={newsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginTop: -40,
    paddingVertical: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 30,
    marginBottom: 20,
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
