import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
const EditProfileScreen = ({ route, navigation }) => {
  const { profileData, token } = route.params || {};
  const [fullName, setFullName] = useState(profileData?.fullName || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUri, setImageUri] = useState(
    profileData?.profilePic && profileData.profilePic !== "default.png"
      ? profileData.profilePic
      : "https://ui-avatars.com/api/?name=" + (profileData?.username || "User"),
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    }
  };
  const handleSaveChanges = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      if (password.trim() !== "") {
        formData.append("password", password);
      }
      if (selectedImage) {
        let localUri = selectedImage.uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append("profilePic", {
          uri: localUri,
          name: filename,
          type,
        });
      }
      const res = await axios.put(
        "https://social-media-platform-bice.vercel.app/api/user/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(
        "Error updating profile:",
        error.response?.data || error.message,
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={30} color="#E5E5EA" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 30 }} />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            </View>
            <TouchableOpacity onPress={handlePickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                placeholderTextColor="#8E8E93"
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>USERNAME</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefixText}>@ </Text>
              <TextInput
                style={[styles.input, { color: "#8E8E93" }]}
                value={profileData?.username || ""}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>BIO</Text>
            <View style={[styles.inputContainer, styles.bioContainer]}>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself..."
                placeholderTextColor="#8E8E93"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor="#8E8E93"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleSaveChanges}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#460283" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#262626",
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#3d3d3d",
    overflow: "hidden",
    marginBottom: 15,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoText: {
    color: "#D8B4FE",
    fontSize: 15,
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    color: "#E5E5EA",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    paddingHorizontal: 15,
    height: 55,
  },
  prefixText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  bioContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 15,
  },
  bioInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    width: "100%",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "#121212",
  },
  saveButton: {
    backgroundColor: "#D8B4FE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#460283",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default EditProfileScreen;
