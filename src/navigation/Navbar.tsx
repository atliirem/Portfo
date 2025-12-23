import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  TouchableOpacityProps,
} from "react-native";

import HomeStack from "./Navbar/HomeStack";
import ListingStack from "./Navbar/ListStack";
import FavoriteStack from "./Navbar/FavoriteStack";
import ProfileStack from "./Navbar/ProfileStack";
import AddStackScreen from "./Navbar/AddStack";

import Ionicons from "react-native-vector-icons/Ionicons";


const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#25C5D1",
        tabBarInactiveTintColor: "#a6a6a6",
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color, }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color}
              
            />
          ),
        }}
      />

      <Tab.Screen
        name="ListingStack"
        component={ListingStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={AddStackScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              activeOpacity={0.85}
              style={styles.createButton}
            >
              <Ionicons name="add" size={36} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="FavoriteStack"
        component={FavoriteStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={28} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    position: "absolute",
    borderTopWidth: 0.4,
    borderTopColor: "#e5e5e5",
    height: Platform.OS === "ios" ? 75 : 60,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButton: {
    top: -20,
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#F9C43E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
});
