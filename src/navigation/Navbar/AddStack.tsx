import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TopBar from "../TopBar"; 
import Create from "../../screens/Create";
import Pass from "../../screens/Create/Components/Pass"
import Komisyon from "../../screens/Create/Components/Komisyon"
import Second from "../../screens/Create/Second";
//import DetailAlerts from "../../screens/Detail/DetailAlerts";


export type AddStackParamList = {
  Create: undefined;
  DetailAlerts: undefined;
  Pass: undefined;
  Komisyon: undefined;
  Second: undefined;
};

const Stack = createNativeStackNavigator<AddStackParamList>();

export default function AddStackScreen() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Create"
        component={Create}
        options={{
          header: () => <TopBar />, 
        }}
      />
       <Stack.Screen
        name="Komisyon"
        component={Komisyon}
        options={{
          header: () => <TopBar />, 
        }}
      />
       <Stack.Screen
        name="Second"
        component={Second}
        options={{
          header: () => <TopBar />, 
        }}
      />
       <Stack.Screen
        name="Pass"
        component={Pass}
        options={{
          header: () => <TopBar />, 
        }}
      />
{/*       
        <Stack.Screen
        name="DetailAlerts"
        component={DetailAlerts}
       options={{
          header: () => <TopBar />,
        }}
      /> */}

    </Stack.Navigator>
  );
}
