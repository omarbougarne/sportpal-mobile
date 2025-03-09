import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import WorkoutDetailContainer from '@/app/containers/workout/WorkoutDetailContainer';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Important: Check if this is a valid MongoDB ObjectId (24-char hex string)
  // This prevents fetching for routes like "/workout/new"
  const isValidObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  
  // For special paths that should be handled elsewhere, redirect
  if (id === 'new') {
    // This shouldn't happen with proper routing setup, but just in case
    console.log('Redirecting from [id].tsx to /workout/new');
    router.replace('/workout/new');
    return null;
  }
  
  // For truly invalid IDs, show an error
  if (!isValidObjectId) {
    return (
      <>
        <Stack.Screen options={{ title: "Invalid Workout" }} />
        <View style={styles.container}>
          <Text style={styles.errorText}>Invalid workout ID</Text>
          <Text style={styles.subText}>The workout ID "{id}" is not valid</Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: "Workout Details" }} />
      <WorkoutDetailContainer id={id as string} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  }
});