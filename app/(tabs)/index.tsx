import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchGroups } from '@/app/services/api/groupApi';
import { Group } from '@/app/types/group';
import { useRouter } from 'expo-router';

export default function Index() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        console.log('Loading groups...');
        const data = await fetchGroups();
        console.log('Groups loaded:', data);
        setGroups(data);
        console.log('State groups after setting:', data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    console.log('State groups updated:', groups);
  }, [groups]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Groups for You</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDetail}>Sport: {item.sport}</Text>
            <Text style={styles.groupDetail}>Activity: {item.activity}</Text>
            <Text style={styles.groupDetail}>Location: {item.location}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(`/user/updateGroup?id=${item._id}`)}
            >
              <Text style={styles.buttonText}>Update Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(`/user/deleteGroup?id=${item._id}`)}
            >
              <Text style={styles.buttonText}>Delete Group</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No groups available</Text>}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/user/createGroup')}
      >
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  groupItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
    width: '100%',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupDetail: {
    fontSize: 16,
    marginBottom: 2,
  },
  emptyMessage: {
    fontSize: 18,
    color: 'gray',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
});