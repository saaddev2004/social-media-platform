import React from 'react';
import { View, StyleSheet } from 'react-native';

const StoryProgressBar = ({ stories, currentStoryIndex }) => {
  return (
    <View style={styles.progressBarContainer}>
      {stories.map((s, idx) => {
        let fillWidth = '0%';
        if (idx < currentStoryIndex) fillWidth = '100%';
        else if (idx === currentStoryIndex) fillWidth = '50%';

        return (
          <View key={s._id || idx} style={styles.progressSegment}>
            <View style={[styles.progressFill, { width: fillWidth }]} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  }
});

export default StoryProgressBar;
