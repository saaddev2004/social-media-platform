import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostItem = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* 1. Post Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: item.userImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.username}>{item.username || 'unknown_user'}</Text>
            <Text style={styles.timeAgo}>{item.timeAgo || '2h ago'}</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
      </View>

      {/* 2. Post Media - Dynamic image link from Unsplash */}
      <Image 
        source={{ uri: item.postImage || 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800' }} 
        style={styles.postImage} 
        resizeMode="cover"
      />

      {/* 3. Post Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="paper-plane-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 4. Caption & Counts */}
      <View style={styles.captionContainer}>
        <Text style={styles.stats}>{item.likes || '1,234'} likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.username}>{item.username || 'user'} </Text>
          {item.caption || 'Exploring the digital world! 🚀'}
        </Text>
        <Text style={styles.commentCount}>View all {item.commentCount || '45'} comments</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  timeAgo: { color: '#A0A0A0', fontSize: 12 },
  postImage: { width: '100%', height: 400, backgroundColor: '#1a1a1a' },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftActions: { flexDirection: 'row' },
  iconButton: { marginRight: 15 },
  captionContainer: { paddingHorizontal: 12 },
  stats: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  caption: { color: '#fff', fontSize: 14, marginBottom: 5 },
  commentCount: { color: '#A0A0A0', fontSize: 13 },
});

export default PostItem;