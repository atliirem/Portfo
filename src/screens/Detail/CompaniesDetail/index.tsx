import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getAllCompanies, getCompany } from "../../../../api";
import CompaniesCard from "../../../components/Cards/CompaniesCard";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ProfileStackParamList } from "../../../navigation/Navbar/ProfileStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export const CompaniesListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { company, loading, error } = useSelector((state: RootState) => state.company);
   const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  if (!company || company.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz firma bulunamadı.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <CompaniesCard
      id={item.id}
      title={item.name}
      image={item.logo}
      type={item.type}
      city={item.properties?.[0]?.city?.title}
      onPress={() => navigation.navigate("CompaniesScreen", { id: item.id })}
     
      
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Firmalar</Text>
        <FlatList
          data={company}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
         />
   
                
           </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -50,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 30,
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
  errorText: {
    fontSize: 16,
    color: "red",
  },
});