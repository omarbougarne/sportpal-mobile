import React from 'react';
import { SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ManageGroup from '@/app/components/group/ManageGroup';

export default function ManageGroupScreen() {
  const { id } = useLocalSearchParams();
  
  if (!id || typeof id !== 'string') {
    return null; // Or handle the error appropriately
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ManageGroup id={id} />
    </SafeAreaView>
  );
}