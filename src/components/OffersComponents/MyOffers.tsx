import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOffers } from '../../../api';
import { AppDispatch, RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import MyOffersCard from '../Cards/MyOffersCard';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const MyOffers = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const { offerList } = useSelector((state: RootState) => state.offers);

  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);

  if (!offerList || offerList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz gönderilen teklif yok</Text>
      </View>
    );
  }

  const renderCard = ({ item }) => (
  <MyOffersCard
    id={item.id}
    property={item.property}
    created_at={item.created_at}
    status={item.status}
    company={item.company}
    offered_price={item.offered_price}
    onPress={() => navigation.navigate("PropertiesDetailScreen", { id: item.id })}
  />
);
  
  return (
    <View style={styles.page}>
      <FlatList
        data={offerList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
      />
    </View>
  );
};

export default MyOffers;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});