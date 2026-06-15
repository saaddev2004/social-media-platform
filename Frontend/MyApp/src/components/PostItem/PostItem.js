import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const PostItem = ({ item, token, currentUserId }) => {
  const navigation = useNavigation();

  const [isLiked, setIsLiked] = useState(item.likes?.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(item.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await axios.put(`https://social-media-platform-bice.vercel.app/api/social/like/${item._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      setIsLiked(previousState);
      setLikesCount(previousState ? likesCount + 1 : likesCount - 1);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `${item.author?.username}: ${item.caption || ''}` });
    } catch (error) {
      console.log(error);
    }
  };

  const author = item.author || {};
  const profilePic = author.profilePic ? (author.profilePic.startsWith('http') ? author.profilePic : `https://social-media-platform-bice.vercel.app/${author.profilePic}`) : `https://ui-avatars.com/api/?name=${author.username || 'User'}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.row}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />
          <Text style={styles.username}>{author.username || 'User'}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
      </View>

      <Image 
        source={{ uri: item.image.startsWith('http') ? item.image : `https://social-media-platform-bice.vercel.app/${item.image}` }} 
        style={styles.postImage} 
      />

      <View style={styles.actions}>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleLike} style={styles.icon}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? "red" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item._id, token, currentUserId })} style={styles.icon}>
            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.icon}>
            <Ionicons name="paper-plane-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.stats}>{likesCount} likes</Text>
        <Text style={styles.caption}><Text style={styles.username}>{author.username} </Text>{item.caption}</Text>
        
        <Text style={styles.commentCount}>View all {item.comments?.length || 0} comments</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10, backgroundColor: '#333' },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  postImage: { width: '100%', height: 400, backgroundColor: '#1a1a1a' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  icon: { marginRight: 15 },
  footer: { paddingHorizontal: 12 },
  stats: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  caption: { color: '#fff', fontSize: 14, marginBottom: 5 },
  commentCount: { color: '#888', fontSize: 13 }
});

export default PostItem;