import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchGroups } from '@/app/services/api/groupApi';

export default function Index() {

  interface Group {
    _id: string;
    name: string;
  }

  const [groups, setGroups] = useState<Group[]>([]);

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
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No groups available</Text>}
      />
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
  },
  emptyMessage: {
    fontSize: 18,
    color: 'gray',
  },
});