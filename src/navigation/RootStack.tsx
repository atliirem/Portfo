

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, View } from "react-native";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import AppNavigator from "./Navbar";
import { DetailAlerts } from "../screens/Detail/DetailAlerts";
import Create from "../screens/Create";
import SummaryScreen from "../screens/Company/CompanySummary";
import { CustomerOffersDetail } from "../screens/Detail/GetCustomerOffers";
import { DetailScreen } from "../screens/ProposalsDetaill/DetailScreens";

import { AuthService } from "../services/AuthService";
import { setUserFromStorage } from "../redux/Slice/authSlice";



export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  App: undefined;
  PropertiesDetailScreen: { id: number };
  MyPropertiesDetailScreen: { id: number };
  NewsDetailScreen: { id: number };
  PropertiesScreen: { id: number };
  DetailAlertsScreen: undefined;
  SummaryScreen: undefined;
  ProposalsComponents: undefined;
  PropertiesScreenProfile: {id: number};
  Favorite: undefined;
  CustomerScreen: undefined;
  AddNewCustomerModal: undefined;
  CompaniesScreen: {id: number};
  CompaniesScreenComponents: {id: number}
  CompanyTeamComponents: {id: number}
  OffersDetail: {id: number}
  OfffersDetail: {id: number}
  BannerDetail: {id: number}
  Create: {id: number}
  GalleryScreen: {id: number};
  Pass: undefined;
  Komisyon: undefined;
  InvitationsScreen: undefined;

  EditProperty: { id: number };
  MySubscriptionsScreen:  {id: number}
  EditTaslak: undefined;
  CreateTaslak: undefined;
  SettingsScreen: undefined;
  SelectCustomerModal: undefined;
 FullScreenGallery: {
    images: { uri: string }[];
    startIndex: number;
  };
  CompanyDetail: {id: undefined}
  CompanyLoc: {id: number}
  SentOffersDetail: {id: number}
  MyOffers: {id: number}
  ProposalsDetail: undefined;
  DetailScreen: {id: number, code: number};
  EditCompany: undefined;
  CustomerOffersDetail: {id: number};

  CompanyDetailScreen: {id: number}

    Second: undefined;
  Taslak: { propertyId: number };
};

  



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUser = await AuthService.getUser();
        console.log("📦 Stored user:", storedUser);

        if (storedUser) {
          dispatch(setUserFromStorage(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, [dispatch]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (

        <>
          <Stack.Screen name="App" component={AppNavigator} />
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} />
          <Stack.Screen name="CustomerOffersDetail" component={CustomerOffersDetail} />
          <Stack.Screen name="DetailAlertsScreen" component={DetailAlerts} />
      
        </>
      ) : (

        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
}