import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import CreateWorkoutContainer from '@/app/containers/workout/CreateWorkoutContainer';

export default function NewWorkoutScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Create Workout",
          headerBackTitle: "Workouts"
        }} 
      />
      <View style={styles.container}>
        <CreateWorkoutContainer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});