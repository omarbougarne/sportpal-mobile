import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WorkoutDetail from '@/app/components/workout/WorkoutDetail';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id) {
    return null; // Or render an error state
  }

  return (
    <View style={styles.container}>
      <WorkoutDetail id={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});