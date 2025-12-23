import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Tabs from "../Navbar";


import Profile from "../../screens/Profile";


const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Profile" component={Profile}/>
      


    </Stack.Navigator>
  );
}
