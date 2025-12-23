import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getTeam } from "../../../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import PersonalCard from "../../Cards/TeamCard";
import { ProfileButton } from "../../Buttons/profileButton";

const TeamScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { personals, loading, error } = useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(getTeam() as any);
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

  const renderItem = ({ item }: any) => (
  <PersonalCard
    personal={{
      image: item.image,
      avatar: item.avatar,
      id: item.id,
      name: item.name,
      roles: item.roles, 
      email: item.contacts?.email,
      city: item.city?.title,
      company: item.company?.title,
      contact: item.contacts,
    }}
  />
);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
      <ProfileButton label="Kullanıcı Davetiyeleri" bg="#c4c4c4" height={40} marginTop={5}/>
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

export default TeamScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -10,
    
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00A7C0",
    marginVertical: 12,
   
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
