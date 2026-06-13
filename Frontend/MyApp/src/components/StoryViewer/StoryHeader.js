import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const StoryHeader = ({ profilePic, username, timeAgo, onClose }) => {
  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image source={{ uri: profilePic }} style={styles.avatar} />
        <View>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>@{username}</Text>
            <MaterialIcons name="verified" size={14} color="#00E5FF" style={styles.verifiedIcon} />
          </View>
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
      </View>

      <View style={styles.headerRight} onStartShouldSetResponder={() => true}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    marginRight: 10,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  timeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  }
});

export default StoryHeader;
