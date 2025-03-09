import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import WorkoutListContainer from '@/app/containers/workout/WorkoutListConatiner';

// Rest of your code...

export default function WorkoutTab() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Workouts',
          headerLargeTitle: true,
        }} 
      />
      <View style={styles.container}>
        <WorkoutListContainer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});