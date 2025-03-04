import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createGroup } from '@/app/services/api/groupApi';
import { useRouter } from 'expo-router';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [activity, setActivity] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    try {
      const newGroup = { name, sport, activity, location };
      console.log('Creating group with data:', newGroup);
      const response = await createGroup(newGroup);
      console.log('Group created:', response);
      router.push('./(tabs)/index'); // Navigate back to the groups list
    } catch (error) {
      console.error('Failed to create group:', error);
      setError('Failed to create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sport"
        value={sport}
        onChangeText={setSport}
      />
      <TextInput
        style={styles.input}
        placeholder="Activity"
        value={activity}
        onChangeText={setActivity}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Create Group" onPress={handleCreate} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});