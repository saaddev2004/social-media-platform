import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ExploreScreen from "../screens/ExploreScreen";
const Tab = createBottomTabNavigator();
const PlaceholderScreen = ({ name }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    }}
  >
    <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "bold" }}>
      {name} Screen
    </Text>
  </View>
);
export default function BottomTabs({ route }) {
  const { token, userId, username } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0.5,
          borderTopColor: "#262626",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Search")
            iconName = focused ? "search" : "search-outline";
          else if (route.name === "Create")
            iconName = focused ? "add-circle" : "add-circle-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ token }}
      />
      <Tab.Screen
        name="Search"
        component={ExploreScreen}
        initialParams={{ token }}
      />
      <Tab.Screen
        name="Create"
        component={CreatePostScreen}
        initialParams={{ token }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ token, userId, username }}
      />
    </Tab.Navigator>
  );
}
