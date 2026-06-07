import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setTimeout(() => {
          if (token) {
            console.log('Token found. Navigating to Home.');
            navigation.replace('Home'); 
          } else {
            console.log('No token. Navigating to Login.');
            navigation.replace('Login');
          }
        }, 2000);
      } catch (error) {
        console.log('Error checking token', error);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Vynce</Text>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#C084FC" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#F3E8FF',
    letterSpacing: 1.5,
    textShadowColor: '#C084FC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 40,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: '40%',
  }
});

export default SplashScreen;
