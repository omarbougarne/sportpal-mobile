// app/(tabs)/_layout.tsx
import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '../context/UserContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarStyle: Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="user/index"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="JoinedGroups"
            options={{
              title: 'Groups',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="user/settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }}
          />
        </Tabs>
      
  );
}
