import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { getGroupById, updateGroup } from '@/app/services/api/groupApi';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
// import DeleteGroup from '../../components/DeleteGroup';
interface UpdateGroupProps {
  id: string;
}
export default function UpdateGroup({ id }: UpdateGroupProps) {
  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [activity, setActivity] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  // const { id } = useLocalSearchParams<{ id: string }>(); 

  useEffect(() => {
    if (!id) {
      console.error('No group ID provided');
      return;
    }

    const loadGroup = async () => {
      try {
        console.log('Loading group information...');
        const data = await getGroupById(id);
        console.log('Group information loaded:', data);
        setGroup(data);
        setName(data.name);
        setSport(data.sport);
        setActivity(data.activity);
        setLocation(data.location);
      } catch (error) {
        console.error('Failed to fetch group information:', error);
      }
    };

    loadGroup();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) {
      console.error('No group ID provided');
      return;
    }

    try {
      const updatedGroup = { name, sport, activity, location };
      console.log('Updating group with data:', updatedGroup);
      const response = await updateGroup(id, updatedGroup);
      console.log('Group updated:', response);
      router.push('/(tabs)'); 
    } catch (error) {
      console.error('Failed to update group:', error);
      setError('Failed to update group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Group</Text>
      {group ? (
        <View>
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
          <Button title="Update Group" onPress={handleUpdate} />
          {/* <DeleteGroup 
        groupId={id} 
        onDeleted={() => router.push('./(tabs)')} 
      /> */}
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
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
});