import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';
import { GroupsProvider } from './context/GroupContext';
import { WorkoutProvider } from './context/workoutContext';
import { AuthProvider } from './context/AuthContext'; 
import { TrainerProvider } from './context/TrainerContext';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider onAuthChange={setIsAuthenticated}>
        <UserProvider isAuthenticated={isAuthenticated}>
          <GroupsProvider>
            <WorkoutProvider>
              <TrainerProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="home" options={{ title: 'Home' }} />
                <Stack.Screen name="profile" options={{ title: 'Profile' }} />
                <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="workout" options={{ headerShown: true }} />
              </Stack>
              </TrainerProvider>
            </WorkoutProvider>
          </GroupsProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}