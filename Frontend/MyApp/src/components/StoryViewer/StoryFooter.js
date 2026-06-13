import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StoryFooter = () => {
  return (
    <KeyboardAvoidingView behavior="height" onStartShouldSetResponder={() => true}>
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
  );
};

const styles = StyleSheet.create({
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

export default StoryFooter;
