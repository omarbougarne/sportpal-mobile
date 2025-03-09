import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import WorkoutDetailContainer from '@/app/containers/workout/WorkoutDetailContainer';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Workout Details',
        headerBackTitle: 'Back'
      }} />
      <View style={styles.container}>
        <WorkoutDetailContainer id={id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});