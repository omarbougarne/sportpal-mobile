import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { fetchCurrentUser } from '@/app/services/api/userApi';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Loading user information...');
        const data = await fetchCurrentUser();
        console.log('User information loaded:', data);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user ? (
        <View>
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Level: {user.level}</Text>
          <Text style={styles.info}>Availability: {user.availability}</Text>
          <Text style={styles.info}>Status: {user.accountStatus}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/user/settings')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>        
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
  info: {
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});