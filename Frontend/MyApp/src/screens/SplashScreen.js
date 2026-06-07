import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // TODO: AsyncStorage se token check karna
    const timer = setTimeout(() => {
      console.log('Token checked. Navigation logic will go here.');
      // navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
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
