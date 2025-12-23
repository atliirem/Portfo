import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';


import TeamScreen from '../../Team/TeamCompınents';
import { ComponentButtonOffers } from '../../Buttons/componentsButtonOffers';



export default function OfffersDetail() {
  const [activeTab, setActiveTab] = useState('detail');

  const tabs = [
    { key: 'detail', label: 'Portföyüm' },
    { key: 'score', label: 'Ekip' },




  ];

  const renderButton = ({ item }: any) => (
    <ComponentButtonOffers
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
        {activeTab === 'detail' && <OfffersDetail />}
        {activeTab === 'score' && <TeamScreen />}
     
     
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