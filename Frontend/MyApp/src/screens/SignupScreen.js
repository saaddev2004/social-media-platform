import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('https://social-media-platform-bice.vercel.app/api/auth/signup', { 
        fullName, 
        username: username.trim(), 
        email: email.trim(), 
        password 
      });
      Alert.alert('Success', res.data.message || 'User registered successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>Vynce</Text>
          <Text style={styles.subtitleText}>Join the electric collective.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#8E8E93" style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="Jordan Doe" 
                placeholderTextColor="#8E8E93"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Feather name="at-sign" size={20} color="#8E8E93" style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="jordan_v" 
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#8E8E93" style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="jordan@example.com" 
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#8E8E93" style={styles.icon} />
              <TextInput 
                style={styles.input} 
                placeholder="••••••••" 
                placeholderTextColor="#8E8E93"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#8E8E93" style={styles.iconRight} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#460283" />
            ) : (
              <>
                <Text style={styles.signupButtonText}>Sign Up </Text>
                <Feather name="arrow-right" size={20} color="#460283" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#F3E8FF',
    letterSpacing: 1.5,
    textShadowColor: '#C084FC',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitleText: {
    color: '#E5E5EA',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    borderColor: '#3d3d3d',
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    color: '#E5E5EA',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    outlineStyle: 'none',
  },
  signupButton: {
    backgroundColor: '#A855F7',
    borderRadius: 25,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#460283',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#E5E5EA',
    fontSize: 14,
    fontWeight: '500',
  },
  loginText: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
