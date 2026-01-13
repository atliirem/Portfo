import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Settings } from 'react-native';
import { ComponentButton } from '../../../../components/Buttons/componentsButton';
import PropertiesScreenProfile from '../../../Detail/DetailPropertiesProfile';
import { Button } from 'react-native-elements';
import Second from '../../Second';
import TaslakInfo from '../../Components/TaslakInfo';
import UploadPhoto from "../../../../components/UploadPhoto"

import PropertyMap from '../../../../components/MapComponents';
import EditProperty from '../../../Edit/EditProperty';
import GalleryScreen from '../../../GalleryScreen';
import PropertiesDetailScreen from '../../../Detail/PropertiesDetailScreen';
import SettingsScreen from '../SettingsScreen';



export default function OffersComponentsScreen( ) {
  const [activeTab, setActiveTab] = useState('Müşteriye Gelen');

  const tabs = [
    { key: 'Müşteriye Gelen Fiyat Teklifleri', label: 'Müşteriye Gelen Fiyat Teklifleri' },
    { key: 'Müşteriye Gönderilen Teklifler', label: 'Müşteriye Gönderilen Teklifler' },
    { key: 'Diğer firmaların oluşturduğu teklifler', label: 'Diğer firmaların oluşturduğu teklifler' },
    

    //  { key: 'Location', label: 'Teklifler' },
    // { key: 'Gallery', label: 'Ayarlar' },
  ];



  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={52}
      width={150}
      marginTop={4}
      onPress={() => setActiveTab(item.key)}
    />
  );

  return (
    <View style={styles.page}>

      <FlatList
        horizontal
        data={tabs}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      />

      <View style={styles.content}>
        {activeTab === 'Müşteriye Gelen' && <EditProperty />}
        {activeTab === 'Müşterilden giden' &&  <PropertyMap/>}
        {activeTab === 'diğer firmaların oluşturduğu teklifler' && <SettingsScreen propertyId={0} />}

        {/* {activeTab === 'Gallery' && < />} */}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
 
   

  },
  buttonContainer: {
    paddingHorizontal: 10,
  


    

  },
  content: {
    flex: 1,


  },
});