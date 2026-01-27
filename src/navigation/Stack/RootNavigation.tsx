import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthService } from '../../services/AuthService';
import { setUserFromStorage } from '../../redux/Slice/authSlice';
import { AppDispatch, RootState } from '../../redux/store';

export default function RootNavigation() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkUserFromStorage = async () => {
      try {
        const storedUser = await AuthService.getUser();
        
        if (storedUser) {
          console.log(" Storage'dan kullanıcı yüklendi:", storedUser.email);
          dispatch(setUserFromStorage(storedUser));
        } else {
          console.log(" Storage'da kullanıcı bulunamadı");
        }
      } catch (error) {
        console.error(" Storage okuma hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserFromStorage();
  }, [dispatch]);

  useEffect(() => {
    console.log("🔐 Auth State - Token:", !!token, "User:", user?.email || "null");
  }, [token, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});