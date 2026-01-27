import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppDispatch, RootState } from "../../../../redux/store";
import MyOffersCard from "../../../Cards/MyOffersCard";
import { getReceivedOffers } from "../../../../../api";

const MyOffers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<any>>();

  const { offerList, loadingOffers, errorOffers } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    dispatch(getReceivedOffers());
  }, [dispatch]);

  if (loadingOffers) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (errorOffers) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorOffers}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!offerList || offerList.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <Text>Henüz alınan bir teklif yok.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <FlatList
        data={offerList}
        keyExtractor={(item) => item.id?.toString() ?? `${Math.random()}`}
        renderItem={({ item }) => (
          <MyOffersCard
            {...item}
            onPress={() => {
              navigation.navigate("MyOffersDetail", { id: item.id });
              console.log("Tıklanan teklif ID:", item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      />
    </SafeAreaView>
  );
};

export default MyOffers;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  listContainer: {
    paddingTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
});
