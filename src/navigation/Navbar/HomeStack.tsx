import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import HomeScreen from "../../screens/HomeScreen";
 import {CustomerOffers} from "../../screens/Detail/CustomerOffers";

import {DetailAlerts} from "../../screens/Detail/DetailAlerts";

 import Offers from "../../screens/Offers";
 import Contact from "../../screens/Contact";
import PropertiesScreen from "../../screens/Detail/DetailProperties";
import NewsDetailScreen from "../../screens/Detail/NewsDetailScreen";
 import NewsListScreen from "../../screens/Detail/DetailNews";
 import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
 import GalleryScreen from "../../screens/GalleryScreen"
 import MyPropertiesDetailScreen from "../../screens/Detail/MyPropertiesDetailScreen"


import TopBar from "../TopBar";
import Top from "../Top";
import FullScreenGallery from "../../screens/GalleryScreen/FullScreenGallery";
import CompanyDetailScreen from "../../screens/Company/CompaniesDetail";
import SelectedPropertiesScreen from "../../screens/Detail/SelectedProperties";

export interface GalleryImage {
  id: number;
  path: {
    small: string;
  };
}




export type HomeStackParamList = {
  HomeScreen: undefined;
  CustomerOffers: undefined;
  PropertiesDetailScreen: { id: number };
  DetailAlerts: undefined;
  Company: undefined;
  Offers: undefined;
  Contact: undefined;
  PropertiesScreen: { id: number };
  NewsDetailScreen: { id: number };
  NewsListScreen: { id: number };
 GalleryScreen: {
  images: GalleryImage[]; 
  startIndex: number;
  MyPropertiesDetailScreen: {id: number};

  FullScreenGallery: {
    images: { uri: string }[];
    startIndex: number;
  };

  CompanyDetailScreen: {id: number}
  SelectedPropertiesScreen: undefined;
};
};



const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          header: () => <TopBar />,
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
        name="PropertiesDetailScreen"
        component={PropertiesDetailScreen}
     
          options={{ headerShown: false }}
      />
  
  <Stack.Screen
  name="SelectedPropertiesScreen"
  component={SelectedPropertiesScreen}
  options={{ title: "Seçilen İlanlar" }}
/>

      <Stack.Screen
        name="MyPropertiesDetailScreen"
        component={MyPropertiesDetailScreen}
     
          options={{ headerShown: false }}
      />
      
      
       <Stack.Screen
        name="GalleryScreen"
        component={GalleryScreen}
       options={{
          header: () => <TopBar />,
        }}
      />
      
     
       <Stack.Screen
        name="CompanyDetailScreen"
        component={CompanyDetailScreen}
       options={{
          header: () => <TopBar />,
        }}
      />
      
      <Stack.Screen
        name="DetailAlerts"
        component={DetailAlerts}
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
      /> */}
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
        name="PropertiesScreen"
        component={PropertiesScreen}
      options={{
           header: () => <Top />,
        }}
      />
      <Stack.Screen
        name="NewsDetailScreen"
        component={NewsDetailScreen}
       options={{
          header: () => <Top />,
        }}
      />
      <Stack.Screen
        name="NewsListScreen"
        component={NewsListScreen}
       options={{
          header: () => <TopBar />,
        }}
      /> 

      <Stack.Screen
  name="FullScreenGallery"
  component={FullScreenGallery}
  options={{
    headerShown: false,
    animation: "fade",
    presentation: "fullScreenModal",
  }}
/>
    </Stack.Navigator>
  );
}
