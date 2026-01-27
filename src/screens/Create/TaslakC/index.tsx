import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/Hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import { updatePropertyLocation } from '../../../../api';
import { ComponentButton } from '../../../components/Buttons/componentsButton';
import EditProperty from '../../Edit/EditProperty';
import PropertyMap from '../../../components/MapComponents';
import GalleryScreen from '../../GalleryScreen';
import OffersComponentsScreen from '../EditProperty/OffersComponentsScreen';
import SettingsScreen from '../EditProperty/SettingsScreen';
import TaslakInfo from '../Components/TaslakInfo';



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

export default function TaslakC({ locationData, propertyId: propId }: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState('Property');
  const dispatch = useAppDispatch();
  
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

  const tabs = [
    { key: 'Property', label: 'Property' },
    { key: 'Location', label: 'Location' },
    { key: 'Gallery', label: 'Gallery' },
    
  ];

  const handleLocationChange = (lat: number, lng: number) => {
    if (!propertyId) {
      Alert.alert("Hata", "İlan ID bulunamadı");
      return;
    }
    
    dispatch(updatePropertyLocation({ 
      propertyId, 
      latitude: lat, 
      longitude: lng 
    }))
      .unwrap()
      .then(() => {
        Alert.alert("Başarılı", "Konum güncellendi");
      })
      .catch((err) => {
        Alert.alert("Hata", err || "Konum güncellenemedi");
      });
  };

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
      
      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          data={tabs}
          renderItem={renderButton}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonContainer}
        />
      </View>

      <View style={styles.content}>
        {/* Property Tab - Her zaman mount, sadece görünürlük değişir */}
        <View style={[
          styles.tabContent,
          { display: activeTab === 'Property' ? 'flex' : 'none' }
        ]}>
          <EditProperty />
        </View>

        {/* Location Tab */}
        <View style={[
          styles.tabContent,
          { display: activeTab === 'Location' ? 'flex' : 'none' }
        ]}>
          <View style={styles.mapContainer}>
            <PropertyMap 
              location={locationData} 
              editable={true}
              onLocationChange={handleLocationChange}  
            />
          </View>
        </View>

        {/* Gallery Tab */}
        <View style={[
          styles.tabContent,
          { display: activeTab === 'Gallery' ? 'flex' : 'none' }
        ]}>
          <GalleryScreen propertyId={propertyId} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContainer: {
    paddingHorizontal: 10,
    gap: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tabContent: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});