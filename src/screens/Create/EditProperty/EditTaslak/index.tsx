import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { ComponentButton } from '../../../../components/Buttons/componentsButton';
import { useAppSelector } from '../../../../redux/Hooks';
import { useRoute, RouteProp } from '@react-navigation/native';
import TaslakInfo from '../../Components/TaslakInfo';
import PropertyMap from '../../../../components/MapComponents';
import EditProperty from '../../../Edit/EditProperty';
import SettingsScreen from '../SettingsScreen';
import OffersComponentsScreen from '../OffersComponentsScreen';
import GalleryScreen from '../../../GalleryScreen';

interface MapOrVideosProps {
  locationData: {
    latitude: string;
    longitude: string;
  } | null | undefined;
  videoUrl?: string | null;
  propertyId?: number; 
}

type RouteParams = {
  Taslak: { propertyId?: number; id?: number };
};

export default function Taslak({ locationData, propertyId: propId }: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState('Property');
  
  const route = useRoute<RouteProp<RouteParams, 'Taslak'>>();
  const { property } = useAppSelector((state) => state.properties);
  const { propertyId: formPropertyId } = useAppSelector((state) => state.form);
  
  const propertyId = 
    propId || 
    route.params?.propertyId || 
    route.params?.id || 
    property?.id || 
    formPropertyId ||
    0;

  console.log("Taslak propertyId:", propertyId);

  const tabs = [
    { key: 'Property', label: 'Property' },
    { key: 'Location', label: 'Location' },
    { key: 'Gallery', label: 'Gallery' },
    { key: 'Teklifler', label: 'Teklifler' },
    { key: 'Haraketler', label: 'Haraketler' },
    { key: 'Ayarlar', label: 'Ayarlar' },
  ];

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={113}
      marginTop={4}
      onPress={() => setActiveTab(item.key)}
    />
  );

  return (
    <View style={styles.page}>
     <TaslakInfo propertyId={propertyId} />
      
      <FlatList
        horizontal
        data={tabs}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      />

      <View style={styles.content}>
        {activeTab === 'Property' && <EditProperty />}
        {activeTab === 'Location' && <PropertyMap location={locationData} />}
        {activeTab === 'Ayarlar' && <SettingsScreen propertyId={propertyId} />}
        {activeTab === 'Teklifler' && <OffersComponentsScreen propertyId={propertyId} />} 
        {activeTab === 'Gallery' && <GalleryScreen propertyId={propertyId} />}
        {/* {activeTab === 'Gallery' && <GalleryScreen propertyId={propertyId} />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginTop: -650,
  },
});