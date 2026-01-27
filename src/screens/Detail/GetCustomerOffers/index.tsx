import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppDispatch, RootState } from "../../../redux/store";
import OffersCard from "../../../components/Cards/OffersCard";
import { RootStackParamList } from "../../../navigation/RootStack";
import { getCustomerProposals } from "../../../../api"; 

type R = RouteProp<RootStackParamList, "CustomerOffersDetail">;
type Nav = NativeStackNavigationProp<RootStackParamList>; 



export const CustomerOffersDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();


  const navigation = useNavigation<Nav>();
const route = useRoute<R>();

const { customer_id, customer_name } = route.params;


  const { proposalsList, loadingProposals, errorProposals } = useSelector(
    (state: RootState) => state.offers
  );

  useEffect(() => {
    dispatch(getCustomerProposals({ customer_id }));
  }, [dispatch, customer_id]);

  const renderCard = ({ item }: any) => (
    <OffersCard
      id={item.id}
      title={item.customer?.name || `Teklif #${item.id}`}
      code={item.code}
      created_at={item.created_at}
      status={item.status}
      company={item.customer?.name}
      property_count={item.property_count}
      image={""}
      expiry_at={""}
      onPress={() =>
        navigation.navigate("DetailScreen", {
          id: item.id,
          code: item.code,
        })
      }
    />
  );

  const Empty = ({ text }: { text: string }) => (
    <View style={styles.center}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {customer_name ? `Teklifler` : "Müşteriye Giden Teklifler"}
        </Text>

        {loadingProposals ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#25C5D1" />
          </View>
        ) : errorProposals ? (
          <Empty text={String(errorProposals)} />
        ) : proposalsList.length === 0 ? (
          <Empty text="Henüz teklif bulunamadı" />
        ) : (
          <FlatList
            data={proposalsList}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginTop: -55,
    paddingBottom: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
    marginLeft: 4,
    marginTop: 8,
  },
  listContainer: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
});
