import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const CreatePostScreen = ({ navigation, route }) => {
  const token = route.params?.token;
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('caption', caption);

    let filename = selectedImage.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append('image', { uri: selectedImage, name: filename, type });

    try {
      const res = await axios.post('https://social-media-platform-bice.vercel.app/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setCaption('');
      setSelectedImage(null);
      Alert.alert("Success", "Post Uploaded Successfully!");
      navigation.navigate('Home');
    } catch (err) {
      console.log("Upload Error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to upload post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Preview / Picker Box */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.postImage} />
          ) : (
            <View style={styles.placeholderBox}>
              <Ionicons name="camera" size={50} color="#fff" />
              <Text style={styles.placeholderText}>Tap to Select Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Caption Section */}
        <View style={styles.captionRow}>
          <TextInput
            style={styles.input}
            placeholder="Write a caption..."
            placeholderTextColor="#666"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
        </View>

        <View style={styles.divider} />

        {/* Options List */}
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="location-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Add Location</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="person-add-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Tag People</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Advanced Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.draftButton}>
          <Text style={styles.buttonText}>Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.publishButtonText}>Publish</Text>
              <Ionicons name="paper-plane" size={16} color="#000" style={{ marginLeft: 5 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imageContainer: { margin: 15, borderRadius: 12, overflow: 'hidden', height: 350, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  postImage: { width: '100%', height: '100%' },
  placeholderBox: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#fff', marginTop: 10, fontSize: 14 },
  captionRow: { padding: 15 },
  input: { color: '#fff', fontSize: 16 },
  divider: { height: 0.5, backgroundColor: '#262626', marginHorizontal: 15 },
  optionItem: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  optionText: { flex: 1, color: '#fff', marginLeft: 15, fontSize: 16 },
  buttonContainer: { flexDirection: 'row', padding: 15, gap: 10 },
  draftButton: { flex: 1, backgroundColor: '#262626', padding: 15, borderRadius: 10, alignItems: 'center' },
  publishButton: { flex: 2, backgroundColor: '#C084FC', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  publishButtonText: { color: '#000', fontWeight: 'bold' }
});

export default CreatePostScreen;