import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import MyOffers from '../../components/OffersComponents/MyOffers';
import SentOffers from '../../components/OffersComponents/SentOffers';
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile"
import {CustomerOffers} from "../../screens/Detail/CustomerOffers"
import TeamScreen from "../../components/Team/TeamCompınents"
import CustomerScreen from '../../components/Customer';
import { ComponentButton } from '../../components/Buttons/componentsButton';


export default function MyPortfoy() {
  const [activeTab, setActiveTab] = useState('myPortfoy');

  const tabs = [
    { key: 'myPortfoy', label: 'Portföyüm' },
    { key: 'team', label: 'Ekip' },
    { key: 'customer', label: 'Müşteriler' },
    { key: 'offers', label: 'Teklifler' },
    { key: 'preference', label: 'Firma Tercihleri' },

  ];

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={105}
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
        {activeTab === 'myPortfoy' && <PropertiesScreenProfile />}
        {activeTab === 'team' && <TeamScreen />}
        {activeTab === 'customer' && <CustomerScreen />}
        {activeTab === 'offers' && <CustomerOffers />}
        {activeTab === 'preference' && <MyOffers />}
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
    gap: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginTop: -650,

  },
});