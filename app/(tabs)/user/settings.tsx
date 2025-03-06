// app/(tabs)/user/settings.tsx
import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { updateUser, deleteUser } from '@/app/services/api/userApi';
import { UserContext } from '../../context/UserContext';

export default function UserSettings() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserSettings must be wrapped in a UserProvider');
  }
  const { user, refreshUser } = userContext;
  const router = useRouter();

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLevel(user.level);
      setAvailability(user.availability);
      setAccountStatus(user.accountStatus);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      if (!user || !user._id) throw new Error('User not loaded yet.');
      const updatedUser = { name, level, availability, accountStatus };
      await updateUser(user._id, updatedUser);

      // After updating on the server, refresh the user in context
      await refreshUser();

      setError(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!user || !user._id) return;
    Alert.alert('Delete Account', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(user._id);
            router.push('/');
          } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user. Please try again.');
          }
        },
      },
    ]);
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
        <Text>Loading user information...</Text>
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
