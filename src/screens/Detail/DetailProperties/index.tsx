import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import FirstCard from "../../../components/Cards/FirstCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


type Props = NativeStackScreenProps<RootStackParamList, "PropertiesScreen">;

const PropertiesScreen: React.FC<Props> = () => {
  const { discountedList , property} = useSelector((state: RootState) => state.properties);
   const navigation = useNavigation<NavigationProp>();

  const renderCard = ({ item }) => (
     <FirstCard
    updated_at= {item.updated_at}
    title={item.title}
    image={item.cover}
    price={item.price.formatted}
   
   // prices={item.prices.primary.formatted ?? ""}
    tag={item.discounted ? "Fiyatı Düştü" : null}
    company={item.company}
    videos={item?.videos}
    
    type={item.type?.title}
    city={item.city?.title}
    district={item.district?.title}
    onPress={() => navigation.navigate("PropertiesDetailScreen", { id: item.id })}
  />
  );

  if (!discountedList || discountedList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz haber bulunamadı</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#ffff'}} >
    <View style={styles.container}>
      <Text style={styles.header}>Fırsat İlanları</Text>
      <FlatList
        data={discountedList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
    </SafeAreaView>
  );
};

export default PropertiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  
    marginTop: -47,
    
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 16,
    marginLeft: 4,

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