import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppDispatch, RootState } from "../../../redux/store";
import { getAllCompanies } from "../../../../api";
import CompaniesCard from "../../../components/Cards/CompaniesCard";
import { RootStackParamList } from "../../../navigation/RootStack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CompaniesListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  
  const { companies, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  const handleCompanyPress = (companyId: number) => {
    navigation.navigate("CompanyDetailScreen", { id: companyId });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hata: {error}</Text>
      </View>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Firma bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CompaniesCard
            id={item.id}
            title={item.name}
            image={item.logo}
            type={item.type}
            city={item.properties?.[0]?.city?.title}
            onPress={() => handleCompanyPress(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CompaniesListScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
});