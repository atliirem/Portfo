import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../redux/store";
import SentOffersCard from "../../Cards/SentOffersCard";
import { getSentOffers } from "../../../../api";

const SentOffers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { proposalsList, loadingProposals, errorProposals } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    dispatch(getSentOffers());
  }, [dispatch]);

  if (loadingProposals) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (errorProposals) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{errorProposals}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!proposalsList || proposalsList.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.center}>
          <Text>Henüz gönderilen bir teklif yok.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <FlatList
        data={proposalsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SentOffersCard
            item={item}
            onPress={() => console.log("Tıklanan teklif ID:", item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 45
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

export default SentOffers;
