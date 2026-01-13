import React, { useEffect } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../../redux/store";
import MyOffersCard from "../../../Cards/MyOffersCard";
import { getReceivedOffers } from "../../../../../api";
import {  NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyOffers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  


  const { offerList, loadingOffers, errorOffers } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    dispatch(getReceivedOffers());
  }, [dispatch]);


  if (loadingOffers) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
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


  if (!offerList || offerList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz alınan bir teklif yok.</Text>
      </View>
    );
  }

  return (
   
    <FlatList
      data={offerList}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => <MyOffersCard 
      onPress={() => {
        navigation.navigate('MyOffersDetail', {id: item.id})
        console.log(" Tıklanan teklif ID:", item.id);
      }}
      {...item} />} 
      contentContainerStyle={styles.listContainer}
    />
  
  );
};

export default MyOffers;

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  listContainer: {
    padding: 10,
  },
  scroll:{
    paddingBottom:160,
  }
});