import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";


import { SafeAreaView } from "react-native-safe-area-context";
import { getOffersDetail } from "../../../../../api";
import { AppDispatch, RootState } from "../../../../redux/store";
import OfferDetailCard from "../../../Cards/ProposalsDetailCard";
import MyOfferDetailCard from "../../../Cards/MyOffersDetailCard";



const MyOfferDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<any>();
  const { id } = route.params;

  const { selectedOffer, loadingOffers, errorOffers } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    if (id) {
      dispatch(getOffersDetail(id));
    }
  }, [dispatch, id]);

  if (loadingOffers) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorOffers) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorOffers}</Text>
      </View>
    );
  }

  if (!selectedOffer) {
    return (
      <View style={styles.center}>
        <Text>Teklif detayı bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <MyOfferDetailCard data={selectedOffer} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   
  },
  container: {
    paddingBottom: 170,
    
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default MyOfferDetail;
