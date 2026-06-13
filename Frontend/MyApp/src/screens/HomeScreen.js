import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import PostItem from '../components/PostItem/PostItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ route, navigation }) => {
  const token = route.params?.token;
  // Login ke waqt agar tumne userId bheji thi to wo yahan access hogi
  const currentUserId = route.params?.userId; 
  
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Backend se Posts fetch karne ka function
  const fetchPosts = async () => {
    try {
      if (!token) return;
      const res = await axios.get('https://social-media-platform-bice.vercel.app/api/posts/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (error) {
      console.log('Error fetching posts:', error.response?.data || error.message);
    }
  };

  // 2. Stories fetch karne ka function
  const fetchStories = async () => {
    try {
      if (!token) return;
      const res = await axios.get('https://social-media-platform-bice.vercel.app/api/stories/feed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const grouped = res.data.reduce((acc, story) => {
        const authorId = story.author._id;
        if (!acc[authorId]) {
          acc[authorId] = { author: story.author, stories: [] };
        }
        acc[authorId].stories.push(story);
        return acc;
      }, {});
      setStories(Object.values(grouped));
    } catch (error) {
      console.log('Error fetching stories:', error.response?.data || error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([fetchStories(), fetchPosts()]).finally(() => setLoading(false));
    }, [token])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  const handleCreateStory = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled) navigation.navigate('CreateStory', { imageUri: result.assets[0].uri, token });
  };

  const handleLogout = () => navigation.replace('Login');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Vynce</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        {loading && stories.length === 0 ? <ActivityIndicator color="#A855F7" /> : (
          <FlatList
            data={[{ isAddButton: true }, ...stories]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.isAddButton ? 'add-btn' : item.author._id}
            renderItem={({ item, index }) => {
              if (item.isAddButton) return (
                <TouchableOpacity style={styles.storyItem} onPress={handleCreateStory}>
                  <View style={[styles.storyRing, styles.transparentBorder]}>
                    <View style={styles.addStoryPlaceholder}><Ionicons name="add" size={24} color="#fff" /></View>
                  </View>
                  <Text style={styles.storyUsername}>Your Story</Text>
                </TouchableOpacity>
              );
              return (
                <TouchableOpacity style={styles.storyItem} onPress={() => navigation.navigate('StoryViewer', { allGroups: stories, initialGroupIndex: index - 1 })}>
                  <View style={styles.storyRing}>
                    <Image source={{ uri: item.author.profilePic !== 'default.png' ? item.author.profilePic : 'https://ui-avatars.com/api/?name=' + item.author.username }} style={styles.storyImage} />
                  </View>
                  <Text style={styles.storyUsername} numberOfLines={1}>{item.author.username}</Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.storiesList}
          />
        )}
      </View>

      {/* Feed Section */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostItem 
            item={item} 
            token={token} 
            currentUserId={currentUserId} // Ye zaroori hai Like logic ke liye
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !loading && (
            <View style={{marginTop: 50}}>
                <Text style={{ color: '#666', textAlign: 'center' }}>No posts available!</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerContainer: { paddingTop: 50, paddingHorizontal: 15, paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#262626', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' },
  storiesContainer: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#262626' },
  storiesList: { paddingHorizontal: 10 },
  storyItem: { alignItems: 'center', marginHorizontal: 8, width: 72 },
  storyRing: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: '#C084FC', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  transparentBorder: { borderColor: 'transparent' },
  storyImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#000' },
  addStoryPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  storyUsername: { color: '#fff', fontSize: 12, textAlign: 'center' }
});

export default HomeScreen;