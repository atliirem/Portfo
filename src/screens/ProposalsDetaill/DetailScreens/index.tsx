import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppDispatch, RootState } from "../../../redux/store";
import { getProposals, } from "../../../../api";
import OffersCard from "../../../components/Cards/OffersCard";
import { RootStackParamList } from "../../../navigation/RootStack";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DetailScreen"
>;

export const DetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
    
  const navigation = useNavigation<NavigationProp>();
   const route = useRoute<any>();

  const { id, code } = route.params;

  useEffect(() => {
    dispatch(getProposals(id));
  }, [dispatch, id]);

  const {
    proposalsList,
    loadingProposals,
    errorProposals,
  } = useSelector((state: RootState) => state.offers);

  const renderCard = ({ item }: any) => (
    <OffersCard
      id={item.id}
      code={item.code}
      title={item.customer?.name || `Teklif #${item.id}`}
      created_at={item.created_at}
      status={item.status}
      company={item.customer?.name}
      property_count={item.property_count}
      onPress={() =>
        navigation.navigate("OfffersDetail", { id: item.id })
      }
    />
  );

  const renderEmpty = (text: string) => (
    <View style={styles.center}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Teklif Kodu: {code} </Text>
        <Text>{code}</Text>

       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginTop: -40,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
    marginLeft: 4,
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 40,
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
});