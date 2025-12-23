import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ComponentButton } from '../../components/Buttons/componentsButton';
import MyOffers from '../../components/OffersComponents/MyOffers';
import SentOffers from '../../components/OffersComponents/SentOffers';


export default function OffersScreen() {
  const [activeTab, setActiveTab] = useState<'offers' | 'sent'>('offers');

  return (
    <View style={styles.page}>

      <View style={styles.buttonContainer}>
        <ComponentButton
          label="Aldığım Teklifler"
          isSelected={activeTab === 'offers' }   
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab('offers')}
        />
        <ComponentButton
          label="Gönderdiğim Teklifler"
          isSelected={activeTab === 'sent'}   
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab('sent')}
        />
      </View>

 
      <View style={styles.content}>
        {activeTab === 'offers' && <MyOffers />}
        {activeTab === 'sent' && <SentOffers />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
});