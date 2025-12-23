import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import AppNavigator from "./Navbar";
import {DetailAlerts} from "../screens/Detail/DetailAlerts";
import SummaryScreen from "../screens/CompanySummary"
import Create from "../screens/Create"



export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  App: undefined;
  PropertiesDetailScreen: { id: number };
  NewsDetailScreen: { id: number };
  PropertiesScreen: { id: number };
  DetailAlertsScreen: undefined;
  SummaryScreen: undefined;
  ProposalsComponents: undefined;
  PropertiesScreenProfile: {id: number}
  Favorite: undefined;
  CustomerScreen: undefined;
  AddNewCustomerModal: undefined;
  CompaniesScreen: undefined;
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
