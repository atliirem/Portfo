import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Listing from "../../screens/Listing";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen";
import TopBar from "../TopBar"; 
import {DetailAlerts} from "../../screens/Detail/DetailAlerts"



export type ListingStackParamList = {
  Listing: undefined;
  PropertiesDetailScreen: { id: number };
  DetailAlerts: undefined;
};

const Stack = createNativeStackNavigator<ListingStackParamList>();

export default function ListingStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Listing"
        component={Listing}
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
