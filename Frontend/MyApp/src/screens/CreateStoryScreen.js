import React, { useState } from 'react';
import { StyleSheet, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import TopControls from '../components/CreateStory/TopControls';
import RightSidebar from '../components/CreateStory/RightSidebar';
import BottomControls from '../components/CreateStory/BottomControls';



const CreateStoryScreen = ({ route, navigation }) => {
  const token = route.params?.token;
  
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
      <SafeAreaView style={styles.backgroundTouch}>
        <TopControls 
          onClose={() => navigation.goBack()} 
          onPickImage={pickImage} 
        />
        <RightSidebar />
        <BottomControls 
          caption={caption} 
          setCaption={setCaption} 
          loading={loading} 
          onPostStory={postStory} 
        />
      </SafeAreaView>
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
  }
});

export default CreateStoryScreen;
