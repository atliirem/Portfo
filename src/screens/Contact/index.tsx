import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ComponentButton } from '../../components/Buttons/componentsButton';
import MyOffers from '../../components/OffersComponents/MyOffers';
import SentOffers from '../../components/OffersComponents/SentOffers';
import ContactForm from '../../components/ContactComponents/ContactForm';
import ContactInfo from '../../components/ContactComponents/ContactInfo';


export default function Contact() {
  const [activeTab, setActiveTab] = useState<'contact' | 'form'>('contact');

  return (
    <View style={styles.page}>

      <View style={styles.buttonContainer}>
        <ComponentButton
          label="İletişim Bilgileri"
          isSelected={activeTab === 'contact' }   
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab('contact')}
        />
        <ComponentButton
          label="İletişim Formu"
          isSelected={activeTab === 'form'}   
          height={40}
          width={165}
          marginTop={10}
          onPress={() => setActiveTab('form')}
        />
      </View>

 
      <View style={styles.content}>
        {activeTab === 'contact' && <ContactInfo />}
        {activeTab === 'form' && <ContactForm />}
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