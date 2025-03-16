import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import TrainerDetailContainer from '@/app/containers/trainer/TrainerDetailContainer';

export default function TrainerDetailScreen() {
  const { id } = useLocalSearchParams();
  
  // Make sure id is a string
  const trainerId = id ? String(id) : '';
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Trainer Profile",
          headerBackTitle: "Back" 
        }} 
      />
      <TrainerDetailContainer id={trainerId} />
    </>
  );
}