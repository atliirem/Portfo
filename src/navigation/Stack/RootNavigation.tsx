// src/navigation/index.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';

//  import { AuthService } from '../../services/AuthService';
//  import { setUserFromStorage } from '../../redux/Slice/AuthSlice';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigation() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const token = useSelector((state:any) => state.auth.token);

  // useEffect(() => {
  //    const checkUserFromStorage = async () => {
  //      const storedUser = await AuthService.getUser();
  //      if (storedUser) {
  //        dispatch(setUserFromStorage(storedUser));
  //     }
  //      setLoading(false);
  //   };

  //  checkUserFromStorage();
  //  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
       
      </View>
    );
  }

  return (
    <NavigationContainer >
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
