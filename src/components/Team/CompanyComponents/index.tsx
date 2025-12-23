import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getCompanyTeam } from "../../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import PersonalCard from "../../Cards/TeamCard";

const CompanyTeamComponents: React.FC = () => {


  const dispatch = useDispatch<AppDispatch>();
  const { personals, loading, error } = useSelector(
    (state: RootState) => state.company
  );

  
   useEffect(() => {
  console.log("TEAM ID:", route?.params?.id);
  dispatch(getCompanyTeam(route?.params?.id) as any);
}, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!personals || personals.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz personel bilgisi bulunamadı.</Text>
      </View>
    );
  }
  console.log("TEAM PAYLOAD:", personals);


  const renderItem = ({ item }: any) => (
    <PersonalCard
      personal={{
        id: item.id,
        avatar: item.avatar,
        name: item.name,
        roles: item.roles || [],
        email: item.contacts?.email || null,
        city: item.city?.title || null,
        company: item.company?.title || null,
        contact: item.contacts,
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <FlatList
          data={personals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default CompanyTeamComponents;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -10,
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
