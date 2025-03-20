import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';
import { useGroups } from '../context/GroupContext';
import UpdateGroup from '../components/group/UpdateGroup';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { user, refreshUser } = useContext(UserContext)!;
  const { groups, loading, error, fetchAllGroups, joinGroupByNameContext } = useGroups();

  useEffect(() => {
    fetchAllGroups();
    refreshUser();
  }, []);



  const handleJoinGroup = async (groupName: string) => {
    if (!user || !user._id) {
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
      refreshUser();
    } catch (err) {
      console.error('Error joining group:', err);
      Alert.alert("Hello", "You are Already a Member");
    }
  };

  if (loading) return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </View>
    </ImageBackground>
  );
  
  if (error) return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    </ImageBackground>
  );

  if(Array.isArray(groups))
  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Best Groups for You</Text>
          <TouchableOpacity 
    style={styles.createGroupButton}
    onPress={() => router.push('/group/create')}
    disabled={!user || !user._id}
  >
    <Text style={styles.createGroupButtonText}>
      {user && user._id ? "Create New Group" : "Login to Create Group"}
    </Text>
    <Ionicons name="add-circle" size={24} color="white" style={styles.createGroupIcon} />
          </TouchableOpacity>
          <FlatList
            data={groups || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.groupItem}>
                <Text style={styles.groupName}>{item.name}</Text>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Sport:</Text>
                  <Text style={styles.detailValue}>{item.sport}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Activity:</Text>
                  <Text style={styles.detailValue}>{item.activity}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{item?.location.city || 'unknown'}</Text>
                </View>
                
                <View style={styles.buttonContainer}>
<TouchableOpacity
  style={styles.viewButton}
  onPress={() => router.push(`/group/${item._id}`)}
>
  <Text style={styles.buttonText}>View Group</Text>
</TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.joinButton, 
                      { opacity: (!user || !user._id) ? 0.7 : 1 }
                    ]}
                    onPress={() => handleJoinGroup(item.name)}
                    disabled={!user || !user._id}
                  >
                    <Text style={styles.buttonText}>
                      {user && user._id ? "Join Group" : "Login to Join"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>No groups available</Text>
              </View>
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Background & Container Styles
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: { 
    flex: 1, 
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
  // Typography Styles
  pageTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  
  // Group Item Styles
  groupItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  groupName: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#BBBBBB',
    fontWeight: 'bold',
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    color: '#F0F0F0',
    flex: 1,
  },
  
  // Button Styles
  viewButton: {
    backgroundColor: 'rgba(12, 54, 88, 0.9)',  // Material Blue
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  joinButton: {
    backgroundColor: 'rgba(17, 134, 64, 0.7)',  // Material Green
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyMessage: { 
    fontSize: 18, 
    color: '#BBBBBB',
    textAlign: 'center',
  },
  // Add these styles to your StyleSheet

// Create Group Button Style
createGroupButton: {
  flexDirection: 'row',
  backgroundColor: 'rgba(76, 50, 171, 0.8)', // Purple color
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginBottom: 20,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: 'rgba(136, 116, 204, 0.5)', // Light purple border
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
createGroupButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 0.5,
  marginRight: 10,
},
createGroupIcon: {
  marginLeft: 5,
},
});