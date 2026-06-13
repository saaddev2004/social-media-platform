import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RightSidebar = () => {
  return (
    <View style={styles.rightSidebar}>
      <TouchableOpacity style={styles.sidebarButton}>
        <Text style={styles.sidebarTextIcon}>T</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton}>
        <Ionicons name="happy-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton}>
        <Ionicons name="musical-note" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton}>
        <Ionicons name="sparkles-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarButton}>
        <Ionicons name="chevron-down" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rightSidebar: {
    position: 'absolute',
    right: 20,
    top: 120,
    alignItems: 'center',
    gap: 15,
  },
  sidebarButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarTextIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default RightSidebar;
