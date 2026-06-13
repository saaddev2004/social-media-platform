import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens import karo
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen'; // CreatePost yahan import kiya

const Tab = createBottomTabNavigator();

// Placeholder component
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>
      {name} Screen
    </Text>
  </View>
);

export default function BottomTabs({ route }) {
  // Login se jo token aaya tha, wo yahan catch ho raha hai
  const { token } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0.5,
          borderTopColor: '#262626',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Create') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Activity') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Yahan se token HomeScreen ko pass ho raha hai */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ token }} 
      />
      
      <Tab.Screen name="Search" children={() => <PlaceholderScreen name="Search" />} />
      
      {/* Yahan se token CreatePostScreen ko pass ho raha hai */}
      <Tab.Screen 
        name="Create" 
        component={CreatePostScreen} 
        initialParams={{ token }} 
      />
      
      <Tab.Screen name="Activity" children={() => <PlaceholderScreen name="Activity" />} />
      <Tab.Screen name="Profile" children={() => <PlaceholderScreen name="Profile" />} />
    </Tab.Navigator>
  );
}