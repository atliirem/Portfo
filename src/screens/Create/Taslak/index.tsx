import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { ComponentButton } from '../../../components/Buttons/componentsButton';
import PropertiesScreenProfile from '../../Detail/DetailPropertiesProfile';
import { Button } from 'react-native-elements';
import Second from '../Second';
import TaslakInfo from '../Components/TaslakInfo';
import UploadPhoto from "../../../components/UploadPhoto"

import PropertyMap from '../../../components/MapComponents';


interface MapOrVideosProps {
  locationData: {
    latitude: string;
    longitude: string;
  } | null | undefined;
  videoUrl?: string | null;  
}

export default function Taslak({ locationData }: MapOrVideosProps) {
  const [activeTab, setActiveTab] = useState('Property');

  const tabs = [
    { key: 'Property', label: 'Property' },
    { key: 'Location', label: 'Location' },
    { key: 'Gallery', label: 'Gallery' },
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
      <TaslakInfo />
      <FlatList
        horizontal
        data={tabs}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonContainer}
      />

      <View style={styles.content}>
        {activeTab === 'Property' && <Second />}
        {activeTab === 'Location' &&   <PropertyMap location={locationData} />}
        {/* {activeTab === 'Gallery' && < />} */}

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