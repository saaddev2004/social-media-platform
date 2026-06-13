import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import PostItem from '../components/PostItem/PostItem'; // Import PostItem
import { SafeAreaView } from 'react-native-safe-area-context';
// import BottomTabs from '../navigation/BottomTabs';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ route, navigation }) => {
  const token = route.params?.token;
  const [stories, setStories] = useState([]);
  // Hard-coded posts for testing the design
  const [posts, setPosts] = useState([
    {
      _id: '1',
      username: 'alexus_x',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      postImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
      timeAgo: '2 hours ago',
      likes: '12.4k',
      caption: 'Lost in the digital ether. New renders exploring fluidity and deep space',
      commentCount: '342'
    },
    {
      _id: '2',
      username: 'neon_nights',
      userImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
      postImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800',
      timeAgo: '5 hours ago',
      likes: '8.1k',
      caption: 'Midnight architecture. Finding lines in the dark.',
      commentCount: '128'
    }
  ]);
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStories();
      // Yahan tum fetchPosts() bhi call karoge jab backend ready hoga
    }, [])
  );

  // ... (handleCreateStory and handleLogout remain same)
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
        {loading ? <ActivityIndicator color="#A855F7" /> : (
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

      {/* Feed Section using PostItem */}
      <FlatList
        data={posts} // Yahan tumhara real API data aayega
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostItem item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {/* <BottomTabs /> */}
    </SafeAreaView>
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
  transparentBorder: {
    borderColor: 'transparent',
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
