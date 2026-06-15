import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabs from './BottomTabs';
import CreateStoryScreen from '../screens/CreateStoryScreen';
import StoryViewerScreen from '../screens/StoryViewerScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      
      {/* Main Tab Navigation */}
      <Stack.Screen name="Main" component={BottomTabs} />
      
      {/* Full Screen Modals / Screens */}
      <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
      <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      
      {/* Contributor's new screen */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      
      {/* Humari Comments Screen with Drawer Effect */}
      <Stack.Screen 
        name="Comments" 
        component={CommentsScreen} 
        options={{ 
          presentation: 'transparentModal', // Peeche ki screen dikhti rahegi
          animation: 'slide_from_bottom'    // Niche se slide ho kar aayega
        }} 
      />
    </Stack.Navigator>
  );
}