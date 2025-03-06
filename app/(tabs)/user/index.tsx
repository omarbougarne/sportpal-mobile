// app/(tabs)/user/index.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';

export default function ProfileScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('ProfileScreen must be wrapped in a UserProvider');
  }

  const { user } = userContext;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user ? (
        <View>
          <Text style={styles.title}>Name: {user.name}</Text>
          <Text style={styles.title}>Level: {user.level}</Text>
          <Text style={styles.title}>Availability: {user.availability}</Text>
          <Text style={styles.title}>Status: {user.accountStatus}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/user/settings')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.title}>Loading user information...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // same styles as before


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