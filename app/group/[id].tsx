import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import GroupDetails from '@/app/components/group/GroupDetails';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <>
      <Stack.Screen options={{ title: "Group Details" }} />
      <View style={styles.container}>
        <GroupDetails id={id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});