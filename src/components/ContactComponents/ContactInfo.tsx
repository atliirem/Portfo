import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getContact } from '../../../api';

const ContactInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contact, loading, error } = useSelector((state: RootState) => state.contact);

  useEffect(() => {
    dispatch(getContact());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!contact) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Telefon</Text>
      <Text style={styles.value}>{contact.phone}</Text>

      <Text style={styles.label}>E-posta</Text>
      <Text style={styles.value}>{contact.email}</Text>

      <Text style={styles.label}>Adres</Text>
      <Text style={styles.value}>{contact.address}</Text>

      <Text style={styles.label}>Bizi takip edin</Text>
      <Text style={styles.value}>{contact.socials.instagram}</Text>
    </View>
  );
};

export default ContactInfo;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});