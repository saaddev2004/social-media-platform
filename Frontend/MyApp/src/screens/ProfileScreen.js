import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
const { width } = Dimensions.get("window");
const POST_MARGIN = 1;
const POST_SIZE = (width - POST_MARGIN * 4) / 3;
export default function ProfileScreen({ route, navigation }) {
  const { token, userId, username } = route.params || {};
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchProfileAndPosts = async () => {
    try {
      if (!username || !token) {
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const profileRes = await axios.get(
        `https://social-media-platform-bice.vercel.app/api/user/profile/${username}`,
        config,
      );
      setProfileData(profileRes.data);
      const postsRes = await axios.get(
        `https://social-media-platform-bice.vercel.app/api/posts/user/${username}`,
        config,
      );
      setPosts(postsRes.data);
    } catch (error) {
      console.log(
        "Error fetching profile:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfileAndPosts();
  }, [username, token]);
  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileAndPosts().finally(() => setRefreshing(false));
  };
  const renderHeader = () => {
    if (!profileData) return null;
    const followerCount = profileData.followers?.length || 0;
    const followingCount = profileData.following?.length || 0;
    const postCount = posts.length || 0;
    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
      }
      return num;
    };
    return (
      <View style={styles.profileHeaderContainer}>
        <View style={styles.topNav}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logoText}>Vynce</Text>
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={{
                uri:
                  profileData.profilePic !== "default.png" &&
                  profileData.profilePic
                    ? profileData.profilePic
                    : "https://ui-avatars.com/api/?name=" +
                      profileData.username,
              }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.onlineDot} />
        </View>
        <Text style={styles.usernameText}>@{profileData.username}</Text>
        <Text style={styles.bioText}>
          {profileData.bio ||
            "Digital creator & aesthetic curator. Living for the neon glow and deep bass. ✨ NY/LA"}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(postCount)}</Text>
            <Text style={styles.statLabel}>POSTS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(followerCount)}</Text>
            <Text style={styles.statLabel}>FOLLOWERS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {formatNumber(followingCount)}
            </Text>
            <Text style={styles.statLabel}>FOLLOWING</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditProfile", { profileData, token })
          }
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postImageContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D8B4FE" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={renderPostItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D8B4FE"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  profileHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
    paddingBottom: 20,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  logoText: {
    color: "#D8B4FE",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    letterSpacing: 1,
  },
  avatarSection: {
    position: "relative",
    marginBottom: 20,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#4b4b66",
    borderTopColor: "#C084FC",
    borderLeftColor: "#C084FC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  onlineDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#00E5FF",
    borderWidth: 2,
    borderColor: "#121212",
  },
  usernameText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bioText: {
    color: "#E5E5EA",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#D1D1D6",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#D8B4FE",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    color: "#460283",
    fontSize: 15,
    fontWeight: "bold",
  },
  postImageContainer: {
    width: POST_SIZE,
    height: POST_SIZE,
    margin: POST_MARGIN,
    backgroundColor: "#1C1C1E",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    paddingTop: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
