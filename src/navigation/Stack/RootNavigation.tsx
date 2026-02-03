// navigation/RootNavigation.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { RootState, AppDispatch } from '../../redux/store';
import { getCompany } from '../../../api';

export default function RootNavigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const userCompany = useSelector((state: RootState) => state.company.company);

  useEffect(() => {
    if (token && user && !userCompany) {
      console.log("🏢 User company'si yükleniyor...");
      dispatch(getCompany());
    }
  }, [token, user, userCompany, dispatch]);


  useEffect(() => {
    if (token && user) {
      console.log(" Auth State:", {
        hasToken: !!token,
        userEmail: user.email,
        userId: user.id,
        companyId: userCompany?.id || 'loading...',
        companyName: userCompany?.name || 'loading...',
      });
    }
  }, [token, user, userCompany]);

  return (
    <NavigationContainer>
      {token && user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}