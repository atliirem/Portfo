import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../../../api";
import { RootState } from "../../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationCard from "../../../components/Cards/NotificationsCard";
import { useFocusEffect } from "@react-navigation/native";

export const DetailAlerts: React.FC = () => {
  const dispatch = useDispatch();
  const { alertsList, loading } = useSelector((state: RootState) => state.properties);
  const [readIds, setReadIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(getNotifications() as any);
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadReadIds = async () => {
        const stored = await AsyncStorage.getItem("@READ_NOTIFICATIONS");
        const ids = stored ? JSON.parse(stored) : [];
        if (isActive) setReadIds(ids);
      };

      loadReadIds();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <NotificationCard
        id={item.id}
        content={item.content}
        time_diff={item.time_diff}
        onPress={() => {}}
      />
    ),
    []
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={[ "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00A7C0" />
          <Text style={styles.centerText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!alertsList || alertsList.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Henüz bildirim yok</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.container}>
        <FlatList
          data={alertsList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          extraData={readIds}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<Text style={styles.header}>Bildirimler</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    paddingTop: 8,
    paddingBottom: 12,
  },
  listContainer: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  centerText: {
    marginTop: 10,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
