import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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

  const handlePress = (item: any) => {
    console.log(" Tıklanan teklif ID:", item.id);
    console.log(" Tıklanan teklif objesi:", item);
  };

  if (loadingProposals) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorProposals) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorProposals}</Text>
      </View>
    );
  }

  if (!proposalsList || proposalsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz gönderilen bir teklif yok.</Text>
      </View>
    );
  }

  return (
 <FlatList
  data={proposalsList}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <SentOffersCard
      item={item}
      onPress={() => {
        console.log(" Tıklanan teklif ID:", item.id);
      }}
    />
  )}
  contentContainerStyle={styles.listContainer}
/>
  );
};

const styles = StyleSheet.create({
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
    padding: 10,
  },
});

export default SentOffers;
