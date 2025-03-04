import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { fetchCurrentUser, updateUser, deleteUser, getUserById } from '@/app/services/api/userApi';
import { useRouter } from 'expo-router';

export default function UserSettings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Loading user information...');
        const data = await fetchCurrentUser();
        console.log('User information loaded:', data);
        setUser(data);
        setName(data.name);
        setLevel(data.level);
        setAvailability(data.availability);
        setAccountStatus(data.accountStatus);
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const updatedUser = { name, level, availability, accountStatus };
      console.log('Updating user information with data:', updatedUser);
      const response = await updateUser(user._id, updatedUser);
      console.log('User information updated:', response);
      setUser(response);
      setError(null);
      // await getUserById(id);
    } catch (error) {
      console.error('Failed to update user information:', error);
      setError('Failed to update user information. Please try again.');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
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
              console.log('Deleting user account...');
              await deleteUser(user._id);
              console.log('User account deleted');
              router.push('/');
            } catch (error) {
              console.error('Failed to delete user account:', error);
              setError('Failed to delete user account. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Settings</Text>
      {user ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Level"
            value={level}
            onChangeText={setLevel}
          />
          <TextInput
            style={styles.input}
            placeholder="Availability"
            value={availability}
            onChangeText={setAvailability}
          />
          <TextInput
            style={styles.input}
            placeholder="Status"
            value={accountStatus}
            onChangeText={setAccountStatus}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <Button title="Update Info" onPress={handleUpdate} />
          <Button title="Delete Account" onPress={handleDelete} color="red" />
        </View>
      ) : (
        <Text style={styles.info}>Loading user information...</Text>
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