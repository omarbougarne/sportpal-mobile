import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../context/GroupContext';
import { Group } from '../../types/group';

interface JoinedGroupsProps {
  onRefresh?: () => void;
}

export default function JoinedGroups({ onRefresh }: JoinedGroupsProps) {
  const { getUserGroups } = useGroups();
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchJoinedGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await getUserGroups();
      setJoinedGroups(userGroups);
      setError(null);
    } catch (err) {
      console.error('Error loading joined groups:', err);
      setError('Failed to load your groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedGroups();
  }, []);

  const handleRefresh = () => {
    fetchJoinedGroups();
    if (onRefresh) onRefresh();
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {joinedGroups.length === 0 ? (
        <Text style={styles.message}>You haven't joined any groups yet.</Text>
      ) : (
        <FlatList
          data={joinedGroups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
            //   onPress={() => router.push(`/group/details?id=${item._id}`)}
            >
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDetail}>Sport: {item.sport || 'Not specified'}</Text>
              <Text style={styles.groupDetail}>Activity: {item.activity || 'Not specified'}</Text>
              <Text style={styles.groupDetail}>Location: {item.location || 'Not specified'}</Text>
              <Text style={styles.groupDetail}>
                Members: {item.members ? item.members.length : 0}
              </Text>
            </TouchableOpacity>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});