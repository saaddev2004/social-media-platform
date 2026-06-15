import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const hardcodedComments = [
  { _id: "hc_1", text: "Flawless composition!", author: { username: "cyber_muse", profilePic: "" }, parentId: null, createdAt: "2h", likes: 124 },
  { _id: "hc_2", text: "Used a 35mm lens for this shot.", author: { username: "creator_v", profilePic: "", isAuthor: true }, parentId: "hc_1", createdAt: "1h", likes: 42 },
];

const CommentsScreen = ({ route, navigation }) => {
  const { postId, token, currentUserId } = route.params; 
  
  const [comments, setComments] = useState(hardcodedComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(`https://social-media-platform-bice.vercel.app/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments([...(res.data.comments || []), ...hardcodedComments]);
    } catch (error) {
      setComments(hardcodedComments);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    const temp = {
      _id: Math.random().toString(), 
      text: newComment,
      author: { _id: currentUserId, username: "You", profilePic: "" }, 
      parentId: replyingTo ? replyingTo._id : null,
      createdAt: "just now"
    };
    
    setComments(prev => [temp, ...prev]); 
    setNewComment('');
    setReplyingTo(null);

    try {
      const res = await axios.post(`https://social-media-platform-bice.vercel.app/api/social/comment/${postId}`, 
        { text: temp.text, parentId: temp.parentId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.comment) {
        setComments(prev => prev.map(c => c._id === temp._id ? res.data.comment : c));
      }
    } catch (error) {
      setComments(prev => prev.filter(c => c._id !== temp._id));
      alert("Failed to post comment.");
    }
  };

  const deleteComment = async (id) => {
    setComments(prev => prev.filter(c => c._id !== id));
    try {
      await axios.delete(`https://social-media-platform-bice.vercel.app/api/social/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      loadData();
      alert("Failed to delete.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.commentCard, item.parentId && styles.replyCard]}>
      <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.author?.username}` }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>@{item.author?.username}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setReplyingTo(item)}><Text style={styles.btn}>Reply</Text></TouchableOpacity>
          {(item.author?._id === currentUserId) && (
            <TouchableOpacity onPress={() => Alert.alert("Delete", "Sure?", [{text: "Delete", onPress: () => deleteComment(item._id)}])}>
              <Text style={[styles.btn, {color: 'red'}]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableOpacity style={styles.dismiss} onPress={() => navigation.goBack()} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color="white" /></TouchableOpacity>
        </View>
        
        {loading ? <ActivityIndicator size="large" color="purple" /> : 
          <FlatList data={comments} renderItem={renderItem} keyExtractor={item => item._id} />
        }

        <View style={styles.inputArea}>
          {replyingTo && <Text style={styles.replying}>Replying to {replyingTo.author?.username}</Text>}
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Add a comment..." placeholderTextColor="#888" value={newComment} onChangeText={setNewComment} />
            <TouchableOpacity onPress={addComment}><Text style={styles.send}>Post</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  dismiss: { flex: 1 },
  sheet: { height: '70%', backgroundColor: '#000', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  commentCard: { flexDirection: 'row', padding: 15 },
  replyCard: { marginLeft: 40 },
  avatar: { width: 35, height: 35, borderRadius: 18, marginRight: 10 },
  info: { flex: 1 },
  username: { color: '#fff', fontWeight: 'bold' },
  text: { color: '#eee', marginVertical: 4 },
  actions: { flexDirection: 'row', gap: 15 },
  btn: { color: '#888', fontSize: 12 },
  inputArea: { padding: 15, borderTopWidth: 1, borderColor: '#333' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, color: '#fff', padding: 10 },
  send: { color: 'purple', fontWeight: 'bold' },
  replying: { color: 'purple', fontSize: 12, marginBottom: 5 }
});

export default CommentsScreen;