import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const getRelativeTime = (dateString) => {
  if (!dateString) return 'just now';
  const diffInMs = new Date() - new Date(dateString);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes < 60) return `${Math.max(0, diffInMinutes)}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const StoryViewerScreen = ({ route, navigation }) => {
  const allGroups = route.params?.allGroups || [];
  const initialGroupIndex = route.params?.initialGroupIndex || 0;

  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const currentGroup = allGroups[currentGroupIndex];

  const stories = React.useMemo(() => {
    if (!currentGroup) return [];
    const rawStories = currentGroup.stories || [];
    return [...rawStories].reverse();
  }, [currentGroup]);

  const currentStory = stories[currentStoryIndex];

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentGroupIndex < allGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      navigation.goBack();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      setCurrentStoryIndex(0);
    } else {
      navigation.goBack();
    }
  };

  const handlePress = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < width * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  useEffect(() => {
    if (!currentStory) return;
    
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentGroupIndex, currentStoryIndex, currentStory]);

  const imageUri = currentStory?.image 
    ? `https://social-media-platform-bice.vercel.app/${currentStory.image.replace(/\\/g, '/')}` 
    : null;

  const username = currentStory?.author?.username || 'vynce_creator';
  const profilePic = currentStory?.author?.profilePic && currentStory.author.profilePic !== 'default.png'
    ? currentStory.author.profilePic
    : `https://ui-avatars.com/api/?name=${username}`;

  const timeAgo = getRelativeTime(currentStory?.createdAt);

  if (!currentStory) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.backgroundWrapper}>
          <ImageBackground source={{ uri: imageUri }} style={styles.background} resizeMode="cover">
            
            <SafeAreaView style={styles.safeArea}>
              

              <View style={styles.progressBarContainer}>
                {stories.map((s, idx) => (
                  <View 
                    key={s._id || idx}
                    style={[
                      styles.progressSegment, 
                      idx <= currentStoryIndex && styles.progressActive
                    ]} 
                  />
                ))}
              </View>


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
                  <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>


              <View style={styles.flexSpace} />


              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} onStartShouldSetResponder={() => true}>
                
                <View style={styles.reactionsContainer}>
                  <TouchableOpacity style={styles.reactionCircle}>
                    <Text style={styles.emojiText}>🔥</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reactionCircle}>
                    <Text style={styles.emojiText}>😍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reactionCircle}>
                    <Text style={styles.emojiText}>😮</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Send message..." 
                      placeholderTextColor="#A0A0A0"
                    />
                  </View>
                  <TouchableOpacity style={styles.footerIconButton}>
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerIconButton}>
                    <Ionicons name="paper-plane-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                
              </KeyboardAvoidingView>

            </SafeAreaView>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundWrapper: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
    gap: 5,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: '#fff',
  },
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
  },
  flexSpace: {
    flex: 1,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 12,
  },
  reactionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emojiText: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
    gap: 15,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.7)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    color: '#fff',
    fontSize: 15,
    outlineStyle: 'none',
  },
  footerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,30,30,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default StoryViewerScreen;
