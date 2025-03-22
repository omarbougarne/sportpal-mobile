import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import EditTrainerContainer from '@/app/containers/trainer/EditTrainerContainer';

export default function EditTrainerScreen() {
  const { id } = useLocalSearchParams();
  const trainerId = typeof id === 'string' ? id : '';
  
  // Handle special cases - keep the original logic!
  const isNew = trainerId === 'new';
  const isSelfEdit = trainerId === 'me';
  
  return (
    <EditTrainerContainer 
        id={isNew || isSelfEdit ? '' : trainerId}
        isNew={isNew} // Keep the original isNew logic
        isSelfEdit={isSelfEdit}
      />
  );
}