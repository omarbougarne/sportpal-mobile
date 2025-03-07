// Create this file: c:\Users\Pc\projets\sportpal-mobile\app\group\[id].tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UpdateGroupComponent from '@/app/components/group/UpdateGroup';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View style={styles.container}>
      <UpdateGroupComponent id={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});