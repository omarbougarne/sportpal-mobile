import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';
import { useGroups } from '../context/GroupContext'; // Assuming this exists
import UpdateGroup from '../components/group/UpdateGroup';

export default function Index() {
  const router = useRouter();
  const { user, refreshUser } = useContext(UserContext)!;
  const { groups, loading, error, fetchAllGroups, joinGroupByNameContext } = useGroups();

  useEffect(() => {
    fetchAllGroups();
    // Refresh user data when component mounts
    refreshUser();
  }, []);

  const handleJoinGroup = async (groupName: string) => {
    if (!user || !user._id) {
      // User is not logged in
      Alert.alert(
        "Authentication Required",
        "You need to login first to join a group.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("./") }
        ]
      );
      return;
    }

    try {
      await joinGroupByNameContext(groupName);
      Alert.alert("Success", "You have successfully joined the group!");
      // Refresh user data after joining to update the UI with new group membership
      refreshUser();
    } catch (err) {
      console.error('Error joining group:', err);
      Alert.alert("Error", "Failed to join group. Please try again later.");
    }
  };

  if (loading) return <Text>Loading groups...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Groups for You</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDetail}>Sport: {item.sport}</Text>
            <Text style={styles.groupDetail}>Activity: {item.activity}</Text>
            <Text style={styles.groupDetail}>Location: {item.location}</Text>
            <TouchableOpacity
  style={styles.button}
  onPress={() => router.push(`./group/${item._id}`)}
>
  <Text style={styles.buttonText}>Update Group</Text>
</TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: user && user._id ? 'green' : '#999' 
              }]}
              onPress={() => handleJoinGroup(item.name)}
              disabled={!user || !user._id}
            >
              <Text style={styles.buttonText}>
                {user && user._id ? "Join Group" : "Login to Join"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No groups available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  groupItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  groupName: { fontSize: 18, fontWeight: 'bold' },
  groupDetail: { fontSize: 16 },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyMessage: { fontSize: 18, color: 'gray' },
});
