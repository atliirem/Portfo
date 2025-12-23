import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../../../api";
import { RootState } from "../../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationCard from "../../../components/Cards/NotificationsCard"
import { useFocusEffect } from "@react-navigation/native";

export const  DetailAlerts: React.FC = () => {
  const dispatch = useDispatch();
  const { alertsList, loading } = useSelector(
    (state: RootState) => state.properties
  );
  const [readIds, setReadIds] = useState<number[]>([]);


  useEffect(() => {
    dispatch(getNotifications() );
  }, [dispatch]);


  useFocusEffect(
    useCallback(() => {
      const loadReadIds = async () => {
        const stored = await AsyncStorage.getItem("@READ_NOTIFICATIONS");
        const ids = stored ? JSON.parse(stored) : [];
        setReadIds(ids);
      };
      loadReadIds();
    }, [])
  );

  const renderItem = ({ item }: any) => (
    <NotificationCard
      id={item.id}
      content={item.content}
      time_diff={item.time_diff}
      onPress={() => {}}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!alertsList || alertsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz bildirim yok</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Bildirimler</Text>
        <FlatList
          data={alertsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          extraData={readIds} 
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    top: -72
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginVertical: 16,
    top: -2
  },
  listContainer: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});