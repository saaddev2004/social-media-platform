import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomControls = ({ caption, setCaption, loading, onPostStory }) => {
  return (
    <KeyboardAvoidingView behavior="height" style={styles.bottomSection}>
      <View style={styles.captionContainer}>
        <TextInput 
          style={styles.captionInput}
          placeholder="Add a caption..."
          placeholderTextColor="#A0A0A0"
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postButton} onPress={onPostStory} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#460283" size="small" />
          ) : (
            <>
              <Text style={styles.postText}>Post Story </Text>
              <Ionicons name="send" size={16} color="#460283" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  captionContainer: {
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  captionInput: {
    color: '#fff',
    fontSize: 16,
    outlineStyle: 'none',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  postText: {
    color: '#460283',
    fontSize: 15,
    fontWeight: 'bold',
  }
});

export default BottomControls;
