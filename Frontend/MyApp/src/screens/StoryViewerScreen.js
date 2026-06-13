import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StoryProgressBar from '../components/StoryViewer/StoryProgressBar';
import StoryHeader from '../components/StoryViewer/StoryHeader';
import StoryFooter from '../components/StoryViewer/StoryFooter';

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
    ? (currentStory.image.startsWith('http') ? currentStory.image : `https://social-media-platform-bice.vercel.app/${currentStory.image.replace(/\\/g, '/')}`)
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
              
              <StoryProgressBar 
                stories={stories} 
                currentStoryIndex={currentStoryIndex} 
              />

              <StoryHeader 
                profilePic={profilePic}
                username={username}
                timeAgo={timeAgo}
                onClose={() => navigation.goBack()}
              />

              <View style={styles.flexSpace} />

              <StoryFooter />

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
    paddingTop: 30,
  },
  flexSpace: {
    flex: 1,
  }
});

export default StoryViewerScreen;
