import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorite from "../../screens/Favorite";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
import TopBar from "../TopBar";
import {DetailAlerts} from "../../screens/Detail/DetailAlerts";

export type FavoriteStackParamList = {
  Favorite: undefined;
  PropertiesDetailScreen: { id: number };
  DetailAlerts: undefined;
  
  
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
        name="DetailAlerts"
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
    </Stack.Navigator>
  );
}
