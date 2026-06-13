import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateStoryScreen = ({ route, navigation }) => {
  
  const [imageUri, setImageUri] = useState(route.params?.imageUri);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const postStory = async () => {
       try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in!');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'story.jpg',
        type: 'image/jpeg',
      });

      const res = await axios.post('https://social-media-platform-bice.vercel.app/api/stories/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      Alert.alert('Success', 'Story posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Story upload error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to upload story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: imageUri }} style={styles.container} resizeMode="cover">
      <View style={styles.backgroundTouch}>
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topRightIcons}>
            <TouchableOpacity style={styles.topIconButton}>
              <Ionicons name="flash-off" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topIconButton} onPress={pickImage}>
              <Ionicons name="sync" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rightSidebar}>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarTextIcon}>T</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Ionicons name="happy-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Ionicons name="musical-note" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Ionicons name="sparkles-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.bottomSection}>
          <View style={styles.captionContainer}>
            <TextInput 
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="#A0A0A0"
              value={caption}
              onChangeText={setCaption}
            />
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.postButton} onPress={postStory} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#460283" size="small" />
              ) : (
                <>
                  <Text style={styles.postText}>Post Story </Text>
                  <Ionicons name="send" size={16} color="#460283" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundTouch: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  topIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSidebar: {
    position: 'absolute',
    right: 20,
    top: 120,
    alignItems: 'center',
    gap: 15,
  },
  sidebarButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarTextIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  captionContainer: {
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  captionInput: {
    color: '#fff',
    fontSize: 16,
    outlineStyle: 'none',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  postText: {
    color: '#460283',
    fontSize: 15,
    fontWeight: 'bold',
  }
});

export default CreateStoryScreen;
