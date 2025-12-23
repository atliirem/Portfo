import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWishlist } from "../../../api";
import FavoriteCard from "../../components/Cards/FavoriteCard";
import { useFocusEffect } from "@react-navigation/native";
import FirstCard from "../../components/Cards/FirstCard";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../navigation/RootStack";
import Ionicons from "@react-native-vector-icons/ionicons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Favorite: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const { favlist, loading, errorDiscount } = useSelector(
    (state: RootState) => state.properties
  );


  useFocusEffect(
    useCallback(() => {
      dispatch(getWishlist() as never);
    }, [dispatch])
  );


  const handleRefresh = () => {
    dispatch(getWishlist() as never);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00A7C0" />
      </View>
    );
  }

  if (errorDiscount) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorDiscount}</Text>
      </View>
    );
  }

  if (!favlist || favlist.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Henüz favori ilan yok</Text>
      </View>
    );
  }

     const renderCard = ({ item }) => (
    <FirstCard
      title={item.title}
      image={item.cover}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
      company={item.company?.title}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() => navigation.navigate('PropertiesDetailScreen', { id: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
        <Text style={styles.header}>Favorilerim</Text>
        <TouchableOpacity >
        <Text style={styles.clean}>Temizle</Text>
        </TouchableOpacity>
       </View>

        <FlatList
          data={favlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor="#00A7C0"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
   clean: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00A7C0",
    marginVertical: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginRight: 12,
    textDecorationLine: 'underline'
    
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
