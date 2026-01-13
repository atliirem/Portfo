import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import AppNavigator from "./Navbar";
import {DetailAlerts} from "../screens/Detail/DetailAlerts";

import Create from "../screens/Create"
import SummaryScreen from "../screens/Company/CompanySummary";



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
  Second: undefined;
  Taslak: undefined;
  EditProperty: { id: number };
  MySubscriptionsScreen:  {id: number}
  EditTaslak: undefined;
  SettingsScreen: undefined;
  SelectCustomerModal: undefined;
  FullScreenGallery: undefined;
  CompanyDetail: {id: undefined}
  CompanyLoc: {id: number}
  SentOffersDetail: {id: number}
  MyOffers: {id: number}
  ProposalsDetail: undefined;
  DetailScreen: {id: number, code: number};

  CompanyDetailScreen: {id: number}


  



};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="App" component={AppNavigator} />
      <Stack.Screen name="SummaryScreen" component={SummaryScreen} />

      <Stack.Screen name="DetailAlertsScreen" component={DetailAlerts} />
    </Stack.Navigator>
  );
}
