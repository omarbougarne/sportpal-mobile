import React from 'react';
import { Stack } from 'expo-router';
import EditTrainerContainer from '@/app/containers/trainer/EditTrainerContainer';

export default function NewTrainerScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: "Become a Trainer",
        headerBackTitle: "Cancel"
      }} />
      <EditTrainerContainer id="" isNew={true} />
    </>
  );
}