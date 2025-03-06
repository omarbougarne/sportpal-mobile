import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from './context/UserContext';
import { GroupsProvider } from './context/GroupContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    
    <UserProvider>
      <GroupsProvider>
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Sign Up',
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    </GroupsProvider>
    </UserProvider>
  );
}