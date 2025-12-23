import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { AppDispatch, RootState } from '../../redux/store';
import { getDiscountedProperties, getRecentlyProperties } from '../../../api';
import FirstCard from '../Cards/FirstCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { useDispatch, useSelector } from 'react-redux';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const DiscountedBanners = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const { discountedList, latestList } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(getDiscountedProperties());
    dispatch(getRecentlyProperties());
  }, [dispatch]);

  if (!discountedList || discountedList.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz indirimde ilan yok</Text>
      </View>
    );
  }

  const renderCard = ({ item }) => (
    <FirstCard
      title={item.title}
      videos ={item?.videos}
      image={item.cover}
      price={item.price?.formatted ?? ""}
      tag={item.discounted ? "Fiyatı Düştü" : null}
       company={item.company}
      type={item.type?.title}
      city={item.city?.title}
      district={item.district?.title}
      onPress={() => navigation.navigate('PropertiesDetailScreen', { id: item.id })}
    />
  );

  return (
    <View style={{ flex: 1, marginLeft: -14, margin: -15 }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Fırsat İlanları</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PropertiesScreen' as never) }>
            <Text style={styles.seeAll}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={discountedList}
          horizontal
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingHorizontal: 10, marginBottom: 20 }}
        />

        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>Yeni İlanlar</Text>
          </View>
          <FlatList
            data={latestList}
            horizontal
            showsHorizontalScrollIndicator={true}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={{ paddingHorizontal: 10, marginBottom: 20}}
          />
        </View>
      </View>
    </View>
  );
};

export default DiscountedBanners;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  
  },
  header: {
    fontWeight: '800',
    fontSize: 18,
    color: '#222',
    marginTop: 20,
  },
  seeAll: {
    color: '#777',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
});
