import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import FilterScreen from '../FilterScreen';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { AppDispatch, RootState } from '../../redux/store'
import { useDispatch, useSelector } from 'react-redux';
import { getDiscountedProperties, getRecentlyProperties } from '../../../api';
import { useEffect } from 'react';
import FirstCard from '../../components/Cards/FirstCard';
import { clearLocationFilters } from '../../redux/Slice/locationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';



type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Index = () => {
    const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
   const { discountedList, latestList } = useSelector((state: RootState) => state.properties);

    useEffect(() => {
       dispatch(getDiscountedProperties());
       dispatch(getRecentlyProperties());
     }, [dispatch]);
   

      if (!discountedList || discountedList.length  === 0) {
         return (
           <View style={styles.center}>
             <Text>Henüz indirimde ilan yok</Text>
           </View>
         );
       }
        const renderCard = ({ item }) => (
    <FirstCard
      title={item.title}
      videos={item?.videos}
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
    <View style={styles.container}>
      
      <FilterScreen />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>İlanlar</Text>
        <View style={styles.rightContainer}>
         <TouchableOpacity
  style={styles.resetButton}
  onPress={() => dispatch(clearLocationFilters())}
>
  <Text style={styles.reset}>Temizle</Text>
</TouchableOpacity>

          <View style={styles.iconWrapper}>
            <Ionicons name="funnel-outline" size={22} color="#999999ff" />
          </View>
         
        </View>
        
      </View>
        <View style={styles.container}>
             
                <FlatList
                  data={discountedList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderCard}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
             
    </View>
   
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,

  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',  
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#41c4cf',
    marginLeft: 22,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  resetButton: {
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  iconWrapper: {
    width: 35,
    height: 35,
    backgroundColor: '#eaebec',
    borderRadius: 10,
    marginRight: 20,
    justifyContent: 'center',  
    alignItems: 'center',      
  },
  reset:{
    color: '#41c4cf',
    textDecorationLine: 'underline',
    fontWeight: '600'
  },
    center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   listContainer: {
    paddingBottom: 40,
  },
});