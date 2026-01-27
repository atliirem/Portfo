import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TopBar from "../TopBar"; 
import Create from "../../screens/Create";
import Pass from "../../screens/Create/Components/Pass"
import Komisyon from "../../screens/Create/Components/Komisyon"
import Second from "../../screens/Create/Second";
import Taslak from "../../screens/Create/Taslak"
import PropertiesScreenProfile from "../../screens/Detail/DetailPropertiesProfile";
import PropertiesDetailScreen from "../../screens/Detail/PropertiesDetailScreen"

import SelectedPropertiesScreen from "../../screens/Detail/SelectedProperties";
import EditTaslak from "../../screens/Create/EditProperty/EditTaslak";


export type AddStackParamList = {
  Create: undefined;
  DetailAlerts: undefined;
  Pass: undefined;
  Komisyon: undefined;
  EditTaslak: undefined;

  PropertiesScreenProfile: {id: number}
  PropertiesDetailScreen: {id: number}

  SelectedPropertiesScreen: undefined;
   Second: undefined;
  Taslak: { propertyId: number };


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
        name="SelectedPropertiesScreen"
        component={SelectedPropertiesScreen}
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
              name="EditTaslak"
              component={EditTaslak}
              options={{
                header: () => <TopBar />, 
              }}
            /> 
      

  <Stack.Screen
        name="Taslak"
        component={Taslak}
        options={{
          header: () => <TopBar />, 
        }}
      />
      <Stack.Screen
        name="PropertiesDetailScreen"
        component={PropertiesDetailScreen}
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

       <Stack.Screen
        name="PropertiesScreenProfile"
        component={PropertiesScreenProfile}
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
