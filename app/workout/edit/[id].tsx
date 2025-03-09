import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import EditWorkout from '@/app/components/workout/EditWorkout';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Workout' }} />
      <View style={styles.container}>
        <EditWorkout id={id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});