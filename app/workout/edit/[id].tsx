import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import EditWorkoutContainer from '@/app/containers/workout/EditWorkoutContainer';

export default function EditWorkoutScreen() {
  // Get the workout ID from the route params
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return null; // Or show an error if ID is missing
  }

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Edit Workout',
        headerBackTitle: 'Back' 
      }} />
      <View style={styles.container}>
        <EditWorkoutContainer id={id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});