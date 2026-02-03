import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Profile from "../../screens/Profile";
import EditProfileScreen from "../../screens/Update/EditProfileInfo";
import ChangePassword from "../../screens/Update/ChangePassword";
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile";
import MyOffers from "../../components/OffersComponents/OffersDetailComponent/MyOffers/MyOffers";
import Offers from "../../screens/Offers";
import Contact from "../../screens/Contact";



import {CustomerOffers} from "../../screens/Detail/CustomerOffers";


import MyPortfoy from "../../screens/MyPortfoy"
import CompanyTeamComponents from "../../components/Team/CompanyComponents"
import OfffersDetail from "../../components/OffersComponents/OffersDetailComponent"


import TopBar from "../TopBar";

import {DetailAlerts} from "../../screens/Detail/DetailAlerts";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
import Favorite from "../../screens/Favorite";

import GalleryScreen from "../../screens/GalleryScreen";
import Taslak from "../../screens/Create/Taslak"

import Top from "../Top";

import EditProperty from "../../screens/Edit/EditProperty";
import MySubscriptionsScreen from "../../screens/PackagePortfoy";
import EditTaslak from "../../screens/Create/EditProperty/EditTaslak";
import SettingsScreen from "../../screens/Create/EditProperty/SettingsScreen";
import SelectCustomerModal from "../../screens/SelectCustomerModal";
import CompaniesScreen from "../../screens/Company/CompanyList";
import Company from "../../screens/Company/CompanyList";
import CompaniesDetailScreen from "../../screens/Company/CompaniesDetail";
import CompanyDetailScreen from "../../screens/Company/CompaniesDetail";
import SummaryScreen from "../../screens/Company/CompanySummary";
import CompanyLoc from "../../screens/Company/CompanyLoc";
import SentOffersDetail from "../../components/OffersComponents/SentOffers/SentOffersDetail"
import MyOfferDetail from "../../components/OffersComponents/OffersDetailComponent/MyOffers/MyOffersDetail";
import ProposalsDetail from "../../screens/ProposalsDetaill/ProposalsDetail";
import { DetailScreen } from "../../screens/ProposalsDetaill/DetailScreens";
import SelectedPropertiesScreen from "../../screens/Detail/SelectedProperties";
import EditCompany from "../../screens/Company/EditCompany";
import FullScreenGallery from "../../screens/GalleryScreen/FullScreenGallery";
import { CustomerOffersDetail } from "../../screens/Detail/GetCustomerOffers";
import InvitationsScreen from "../../components/Team/Invitations";
import PushNewPassword from "../../screens/Update/LostPassword/PushNewPassword";
import VerifyCode from "../../screens/Update/LostPassword/VerifyCode";



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
  CustomerOffersDetail: undefined;
  CreateTaslak: undefined;


  Notification: undefined;
  SummaryScreen: undefined;
  DetailAlerts: undefined;
  MyPortfoy: undefined;
  PropertiesDetailScreen: {id: number}
  MyPropertiesDetailScreen: {id: number}
  Favorite: undefined;
  CompaniesScreen: {id: number};
  CompanyTeamComponents: {id: number}
  OffersDetail: {id: number}
  OfffersDetail: {id: number}
  InvitationsScreen: undefined;

  EditProperty: { id: number };
  MySubscriptionsScreen: undefined;

  PushNewPassword: undefined;
  VerifyCode: undefined;

  SettingsScreen: undefined;
  SelectCustomerModal: undefined;
  SentOffersDetail: {id: number}
  CompanyLoc: {id: number}
  MyOffersDetail: {id: number}
  ProposalsDetail: {id: number, code: number};
  DetailScreen: {id: number, code: number}
     Second: undefined;
  Taslak: { propertyId: number };
   SelectedPropertiesScreen: undefined;
   EditCompany: undefined;
  FullScreenGallery: {
    images: { uri: string }[];
    startIndex: number;
  };
  


CompanyDetailScreen: {id: number}

  
  
  
 
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
      <Stack.Screen
        name="CompaniesScreen"
        component={CompaniesScreen}
        options={{
          header: () => <TopBar />, 
        }}
      /> 
      
         <Stack.Screen
        name="PushNewPassword"
        component={PushNewPassword}
        options={{
          header: () => <TopBar />, 
        }}
      /> 
   
        <Stack.Screen
        name="VerifyCode"
        component={VerifyCode}
        options={{
          header: () => <TopBar />, 
        }}
      /> 

       <Stack.Screen
        name="EditTaslak"
        component={EditTaslak}
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
        name="SelectedPropertiesScreen"
        component={SelectedPropertiesScreen}
        options={{
          headerShown: false }}
        
      />  
   
     <Stack.Screen
        name="EditCompany"
        component={EditCompany}
        options={{
          header: () => <Top />, 
        }}
      />

        <Stack.Screen
        name="SentOffersDetail"
        component={SentOffersDetail}
        options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen
        name="ProposalsDetail"
        component={ProposalsDetail}
        options={{
          header: () => <Top />, 
        }}
      />
        <Stack.Screen
        name="CustomerOffersDetail"
        component={CustomerOffersDetail}
        options={{
          header: () => <Top />, 
        }}
      />
       <Stack.Screen
        name="MyOffersDetail"
        component={MyOfferDetail}
        options={{
          header: () => <Top />, 
        }}
      />
        <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{
          header: () => <Top />, 
        }}
      />
      <Stack.Screen 
  name="FullScreenGallery" 
  component={FullScreenGallery}
  options={{ 
    headerShown: false,
    presentation: 'fullScreenModal' 
  }}
/>
        <Stack.Screen
        name="OfffersDetail"
        component={OfffersDetail}
        options={{
          header: () => <Top />, 
        }}
      />
       <Stack.Screen
        name="EditProperty"
        component={EditProperty}
        options={{
          header: () => <Top />, 
        }}
      />

       <Stack.Screen
        name="CompanyLoc"
        component={CompanyLoc}
        options={{
          header: () => <Top />, 
        }}
      />

      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          header: () => <Top />, 
        }}
      />

<Stack.Screen
        name="SelectCustomerModal"
        component={SelectCustomerModal}
        options={{
          header: () => <Top />, 
        }}
      />

<Stack.Screen
        name="InvitationsScreen"
        component={InvitationsScreen}
        options={{
          header: () => <Top />, 
        }}
      />

<Stack.Screen
        name="CompanyDetailScreen"
        component={CompanyDetailScreen}
        options={{
          header: () => <Top />, 
        }}
      />

<Stack.Screen
        name="Company"
        component={Company}
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
        name="Taslak"
        component={Taslak}
        options={{
          header: () => <Top />, 
        }}
      />


<Stack.Screen
        name="MySubscriptionsScreen"
        component={MySubscriptionsScreen}
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
     <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
      options={{
          header: () => <TopBar />, 
        }} />
     
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
        name="Favorite"
        component={Favorite}
       options={{
          header: () => <TopBar />,
        }}
      />
   
       
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
