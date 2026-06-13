import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PostItem = ({ item, token, currentUserId }) => {
  // 1. States
  const [isLiked, setIsLiked] = useState(item.likes?.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(item.likes?.length || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Double-click ko rokne ke liye

  // 2. Like/Unlike Handle
  const handleLike = async () => {
    if (isProcessing) return; // Agar request chal rahi hai, to kuch na karo

    setIsProcessing(true); // Process lock on
    const previousState = isLiked;
    
    // Optimistic Update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await axios.put(`https://social-media-platform-bice.vercel.app/api/social/like/${item._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Error aaye to wapas purani state par jao
      setIsLiked(previousState);
      setLikesCount(previousState ? likesCount + 1 : likesCount - 1);
      console.log("Like error:", error);
    } finally {
      setIsProcessing(false); // Process lock off
    }
  };

  // 3. Share Handle
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by ${item.author?.username}: ${item.caption || ''}`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const author = item.author || {};
  const profilePic = author.profilePic 
    ? (author.profilePic.startsWith('http') ? author.profilePic : `https://social-media-platform-bice.vercel.app/${author.profilePic}`)
    : `https://ui-avatars.com/api/?name=${author.username || 'User'}`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />
          <Text style={styles.username}>{author.username || 'unknown_user'}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
      </View>

      {/* Image */}
      <Image 
        source={{ uri: item.image.startsWith('http') ? item.image : `https://social-media-platform-bice.vercel.app/${item.image}` }} 
        style={styles.postImage} 
      />

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? "red" : "#fff"} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="paper-plane-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Caption & Stats */}
      <View style={styles.captionContainer}>
        <Text style={styles.stats}>{likesCount} likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.username}>{author.username} </Text>
          {item.caption}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10, backgroundColor: '#333' },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  postImage: { width: '100%', height: 400, backgroundColor: '#1a1a1a' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  leftActions: { flexDirection: 'row' },
  iconButton: { marginRight: 15 },
  captionContainer: { paddingHorizontal: 12 },
  stats: { color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  caption: { color: '#fff', fontSize: 14, marginBottom: 5 },
});

export default PostItem;