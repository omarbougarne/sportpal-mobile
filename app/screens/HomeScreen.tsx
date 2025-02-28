import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <Link href="./#">Go to Profile</Link>
    </View>
  );
}