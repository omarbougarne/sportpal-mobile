import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserGroups } from '../../services/api/groupApi';
import { Group } from '../../types/group';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JoinedGroupsProps {
  onRefresh?: () => void;
}

export default function JoinedGroups({ onRefresh }: JoinedGroupsProps) {
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

// In your fetchJoinedGroups function:
const fetchJoinedGroups = useCallback(async () => {
  try {
    setLoading(true);
    console.log('Fetching joined groups...');
    
    // First attempt
    let userGroups = await getUserGroups();
    
    // Make sure we have an array
    if (!Array.isArray(userGroups)) {
      console.warn('Response was not an array, initializing empty array');
      userGroups = [];
    }
    
    console.log(`Fetched ${userGroups.length} groups:`, 
      userGroups.map(g => ({id: g._id, name: g.name})));
    
    setJoinedGroups(userGroups);
    setError(null);
  } catch (err) {
    console.error('Error loading joined groups:', err);
    setError('Failed to load your groups');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchJoinedGroups();
  }, [fetchJoinedGroups]);

  const handleRefresh = () => {
    fetchJoinedGroups();
    if (onRefresh) onRefresh();
  };

  const navigateToGroup = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.message}>Loading your groups...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

// Update the empty state in the return statement
return (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.title}>My Groups</Text>
      <TouchableOpacity onPress={handleRefresh} style={styles.refreshIcon}>
        <Text style={styles.refreshIconText}>🔄</Text>
      </TouchableOpacity>
    </View>
    
    {joinedGroups.length === 0 ? (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>You haven't joined any groups yet</Text>
        <TouchableOpacity 
          style={styles.discoverButton}
          onPress={() => router.push('/(tabs)/group')}
        >
          <Text style={styles.discoverButtonText}>Discover Groups</Text>
        </TouchableOpacity>
        
        {/* Keep debugging tool for now */}
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>Debugging Info:</Text>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={async () => {
              // Check authentication status
              const token = await AsyncStorage.getItem('authToken');
              const userData = await AsyncStorage.getItem('userData');
              alert(`Token exists: ${!!token}\nUser data exists: ${!!userData}`);
              
              // Force refresh
              fetchJoinedGroups();
            }}
          >
            <Text style={styles.debugButtonText}>Check Auth & Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <FlatList
        data={joinedGroups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => navigateToGroup(item._id)}
          >
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDetail}>Sport: {item.sport || 'Not specified'}</Text>
            <Text style={styles.groupDetail}>Activity: {item.activity || 'Not specified'}</Text>
            <Text style={styles.groupDetail}>
              Location: {typeof item.location === 'object' 
                ? (item.location.name || 'No location')
                : (item.location || 'Not specified')}
            </Text>
            <Text style={styles.groupDetail}>
              Members: {item.members ? item.members.length : 0}
            </Text>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshIcon: {
    padding: 8,
  },
  refreshIconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  discoverButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  discoverButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  groupItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDetail: {
    fontSize: 16,
    marginBottom: 4,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  debugSection: {
  marginTop: 20,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
},
debugText: {
  fontSize: 14,
  color: '#666',
},
debugButton: {
  marginTop: 10,
  backgroundColor: '#555',
  padding: 8,
  borderRadius: 4,
  alignItems: 'center',
},
debugButtonText: {
  color: 'white',
},
// Add these styles
emptyStateContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 100,
},
emptyStateText: {
  fontSize: 18,
  color: '#666',
  marginBottom: 20,
  textAlign: 'center',
},
});