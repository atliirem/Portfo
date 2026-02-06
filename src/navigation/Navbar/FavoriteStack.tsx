import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorite from "../../screens/Favorite";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
import TopBar from "../TopBar";
import {DetailAlerts} from "../../screens/Detail/DetailAlerts";
import SelectedPropertiesScreen from "../../screens/Detail/SelectedProperties";
import CompanyDetailScreen from "../../screens/Company/CompaniesDetail";
import EditTaslak from "../../screens/Create/EditProperty/EditTaslak";
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile"

export type FavoriteStackParamList = {
  Favorite: undefined;
  PropertiesDetailScreen: { id: number };
  DetailAlerts: undefined;
  SelectedPropertiesScreen: undefined;
  CompanyDetailScreen: {id: number}
  EditTaslal: undefined;
  PropertiesScreenProfile: undefined;

};

const Stack = createNativeStackNavigator<FavoriteStackParamList>();

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
     
      <Stack.Screen
        name="Favorite"
        component={Favorite}
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
        name="PropertiesScreenProfile"
        component={PropertiesScreenProfile}
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
            <Stack.Screen
        name="EditTaslak"
        component={EditTaslak}
       options={{
          header: () => <TopBar />,
        }}
      /> 
        <Stack.Screen
  name="SelectedPropertiesScreen"
  component={SelectedPropertiesScreen}
  options={{ title: "Seçilen İlanlar" }}
/>


      <Stack.Screen
        name="PropertiesDetailScreen"
        component={PropertiesDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
