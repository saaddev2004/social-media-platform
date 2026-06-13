import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('https://social-media-platform-bice.vercel.app/api/stories/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const grouped = res.data.reduce((acc, story) => {
        const authorId = story.author._id;
        if (!acc[authorId]) {
          acc[authorId] = {
            author: story.author,
            stories: []
          };
        }
        acc[authorId].stories.push(story);
        return acc;
      }, {});

      const storyGroups = Object.values(grouped);
      setStories(storyGroups);
    } catch (error) {
      console.log('Error fetching stories:', error.response?.data || error.message);
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [])
  );

  const handleCreateStory = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('CreateStory', { imageUri: result.assets[0].uri });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Vynce</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.storiesContainer}>
        {loading ? (
          <ActivityIndicator color="#A855F7" />
        ) : (
          <FlatList 
            data={[{ isAddButton: true }, ...stories]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.isAddButton ? 'add-btn' : item.author._id}
            renderItem={({ item, index }) => {
              if (item.isAddButton) {
                return (
                  <TouchableOpacity style={styles.storyItem} onPress={handleCreateStory}>
                    <View style={[styles.storyRing, { borderColor: 'transparent' }]}>
                      <View style={styles.addStoryPlaceholder}>
                        <Ionicons name="add" size={24} color="#fff" />
                      </View>
                    </View>
                    <Text style={styles.storyUsername}>Your Story</Text>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity 
                  style={styles.storyItem} 
                  onPress={() => navigation.navigate('StoryViewer', { allGroups: stories, initialGroupIndex: index - 1 })}
                >
                  <View style={styles.storyRing}>
                    <Image 
                      source={{ uri: item.author.profilePic !== 'default.png' ? item.author.profilePic : 'https://ui-avatars.com/api/?name=' + item.author.username }} 
                      style={styles.storyImage} 
                    />
                  </View>
                  <Text style={styles.storyUsername} numberOfLines={1}>
                    {item.author.username}
                  </Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.storiesList}
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>Feed Content Goes Here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  storiesList: {
    paddingHorizontal: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#C084FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
  },
  addStoryPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  storyUsername: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#A0A0A0',
    fontSize: 16,
  }
});

export default HomeScreen;
