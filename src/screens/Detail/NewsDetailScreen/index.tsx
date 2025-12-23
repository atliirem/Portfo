import React from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "NewsDetailScreen">;

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const { newsList } = useSelector((state: RootState) => state.properties);


  const { htmlToText } = require("html-to-text");

  const newsItem = newsList.find((news) => news.id === id);

  if (!newsItem) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Haber bulunamadı</Text>
      </View>
    );
  }


  const textBody = htmlToText(newsItem.body || "", {
    wordwrap: 130,
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']} >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: newsItem.cover }} style={styles.image} />

        <Text style={styles.title}>{newsItem.title}</Text>

       

        <Text style={styles.content}>
          {textBody.trim() || "Bu haberin detayı bulunamadı."}
        </Text>

        <Text style={styles.meta}>
          {newsItem.created_at} 
          </Text>
          <Text>
           {newsItem.creator}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 18, paddingBottom: 70 },

  image: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 18,
    marginTop: -18
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
    
  },

  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginTop: 5,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
});
