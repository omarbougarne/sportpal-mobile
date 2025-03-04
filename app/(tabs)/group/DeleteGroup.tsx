import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, Alert } from 'react-native';
import { getGroupById, deleteGroup } from '@/app/services/api/groupApi';
import { useRouter, useLocalSearchParams } from 'expo-router'; 

export default function DeleteGroup() {
  const [group, setGroup] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); 

  useEffect(() => {
    const loadGroup = async () => {
      try {
        console.log('Loading group information...');
        const data = await getGroupById(id);
        console.log('Group information loaded:', data);
        setGroup(data);
      } catch (error) {
        console.error('Failed to fetch group information:', error);
      }
    };

    loadGroup();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting group...');
              await deleteGroup(id);
              console.log('Group deleted');
              router.push('./(tabs)/index'); // Navigate back to the groups list
            } catch (error) {
              console.error('Failed to delete group:', error);
              setError('Failed to delete group. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Group</Text>
      {group ? (
        <View>
          <Text style={styles.info}>Name: {group.name}</Text>
          <Text style={styles.info}>Sport: {group.sport}</Text>
          <Text style={styles.info}>Activity: {group.activity}</Text>
          <Text style={styles.info}>Location: {group.location}</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <Button title="Delete Group" onPress={handleDelete} color="red" />
        </View>
      ) : (
        <Text style={styles.info}>Loading group information...</Text>
      )}
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
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});