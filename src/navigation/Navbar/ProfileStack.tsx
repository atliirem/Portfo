import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Profile from "../../screens/Profile";
import EditProfileScreen from "../../screens/Update/EditProfileInfo";
import ChangePassword from "../../screens/Update/ChangePassword";
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile";
import MyOffers from "../../components/OffersComponents/MyOffers";
import Offers from "../../screens/Offers";
import Contact from "../../screens/Contact";


import {CustomerOffers} from "../../screens/Detail/CustomerOffers";

import SummaryScreen from "../../screens/CompanySummary";
import MyPortfoy from "../../screens/MyPortfoy"
import CompanyTeamComponents from "../../components/Team/CompanyComponents"
import OfffersDetail from "../../components/OffersComponents/OffersDetailComponent"



import TopBar from "../TopBar";

import {DetailAlerts} from "../../screens/Detail/DetailAlerts";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
import Favorite from "../../screens/Favorite";

import GalleryScreen from "../../screens/GalleryScreen";


import OffersDetail from "../../screens/Detail/OffersDetailComponets";
import CompaniesScreen from "../../screens/Company";
import Top from "../Top";

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfileScreen: undefined;
  ChangePassword: undefined;
  PropertiesScreenProfile: {id: number};
  MyOffers: undefined;
  Offers: undefined;
  Contact: undefined;
  DetailAlertsScreen: undefined;
  Company: undefined;
  CustomerOffers: undefined;
  Notification: undefined;
  SummaryScreen: undefined;
  DetailAlerts: undefined;
  MyPortfoy: undefined;
  PropertiesDetailScreen: {id: number}
  Favorite: undefined;
  CompaniesScreen: {id: number};
  CompanyTeamComponents: {id: number}
  OffersDetail: {id: number}
  OfffersDetail: {id: number}
  
  
  
 
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
    
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: () => <TopBar />, 
        }}
      />
     {/* <Stack.Screen
        name="CompaniesScreen"
        component={CompaniesScreen}
        options={{
          header: () => <TopBar />, 
        }}
      />  */}
        <Stack.Screen
        name="OfffersDetail"
        component={OfffersDetail}
        options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen
        name="OffersDetail"
        component={OffersDetail}
        options={{
          header: () => <Top />, 
        }}
      />

       <Stack.Screen
        name="GalleryScreen"
        component={GalleryScreen}
        options={{
          header: () => <TopBar />,  }}
      />
  
        <Stack.Screen
        name="CompanyTeamComponents"
        component={CompanyTeamComponents}
        options={{
          header: () => <Top />, 
        }}
      />


      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          header: () => <TopBar />, 
        }}
      />
      {/* <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
      options={{
          header: () => <TopBar />, 
        }} */}
     
      <Stack.Screen
        name="PropertiesScreenProfile"
        component={PropertiesScreenProfile}
       options={{
          header: () => <Top />, 
        }}
      />
       <Stack.Screen
        name="MyPortfoy"
        component={MyPortfoy}
       options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen
        name="MyOffers"
        component={MyOffers}
        options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen
        name="Offers"
        component={Offers}
       options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          header: () => <TopBar />, 
        }}
      />
      <Stack.Screen
        name="DetailAlertsScreen"
        component={DetailAlerts}
       options={{
          header: () => <TopBar />,
        }}
      />
       <Stack.Screen
        name="PropertiesDetailScreen"
        component={PropertiesDetailScreen}
      options={{ headerShown: false }}
      />
       <Stack.Screen
        name="Favorite"
        component={Favorite}
       options={{
          header: () => <TopBar />,
        }}
      />
      {/* <Stack.Screen
        name="Company"
        component={Company}
        options={{
          header: () => <TopBar />, 
        }} 
      />
       */}
       
      <Stack.Screen
        name="SummaryScreen"
        component={SummaryScreen}
        options={{
          header: () => <Top />,
        }}
      />
      

       <Stack.Screen
        name="CustomerOffers"
        component={CustomerOffers}
        options={{
          header: () => <Top />,
        }}
      />

        <Stack.Screen
        name="DetailAlerts"
        component={DetailAlerts}
       options={{
          header: () => <TopBar />,
        }}
      />

    </Stack.Navigator>
  );
}
