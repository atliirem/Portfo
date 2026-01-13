import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import MyOffers from '../../../components/OffersComponents/OffersDetailComponent/MyOffers/MyOffers';
import SentOffers from '../../../components/OffersComponents/SentOffers/SentOffers';
import PropertiesScreenProfile from "../../Detail/DetailPropertiesProfile"
import {CustomerOffers} from "../../Detail/CustomerOffers"
import TeamScreen from "../../../components/Team/TeamCompınents"
import CustomerScreen from '../../../components/Customer';
import { ComponentButton } from '../../../components/Buttons/componentsButton';
import { DetailScreen } from '../DetailScreens';


export default function ProposalsDetail() {
  const [activeTab, setActiveTab] = useState('ProposalsDetail');

  const tabs = [
    { key: 'ProposalsDetail', label: 'Teklif Detayı' },
    { key: 'rating', label: 'Değerlendirme' },

  ];

  const renderButton = ({ item }: any) => (
    <ComponentButton
      label={item.label}
      isSelected={activeTab === item.key}
      height={40}
      width={165}
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
        {activeTab === 'ProposalsDetail' && <DetailScreen />}
        {activeTab === 'rating' && <TeamScreen />}
        
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