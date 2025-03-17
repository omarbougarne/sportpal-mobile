import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import UpdateGroupComponent from '@/app/components/group/UpdateGroup';

export default function EditGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <>
      <Stack.Screen options={{ title: "Edit Group" }} />
      <View style={styles.container}>
        <UpdateGroupComponent id={id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});