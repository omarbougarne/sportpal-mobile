import React, { useState, useContext } from 'react';
import { TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/app/context/AuthContext';
import { logout } from '@/app/services/api/authApi';

// Define the props interface
interface LogoutButtonProps {
  color?: string;
  size?: number;
  onLogoutComplete?: () => void;
}

export default function LogoutButton({ 
  color = '#FF3B30', 
  size = 24,
  onLogoutComplete
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Access auth context
  const authContext = useContext(AuthContext);
  
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              console.log("Starting logout process...");
              
              // First clear the token, as this is the most important part
              await AsyncStorage.removeItem('authToken');
              console.log("Auth token removed from storage");
              
              // Try API logout but don't wait for it to complete the flow
              try {
                await logout();
                console.log("API logout successful");
              } catch (apiError) {
                console.log("API logout failed, continuing with local logout", apiError);
              }
              
              // Update auth context state
              if (authContext && authContext.logout) {
                await authContext.logout();
                console.log("Context logout successful");
              }
              
              // Call optional callback
              if (onLogoutComplete) {
                onLogoutComplete();
              }
              
              console.log("Navigating to login screen...");
              
              // Add small delay to ensure state updates before navigation
              setTimeout(() => {
                // Use replace instead of reset for Expo Router
                router.push('/Login');
                console.log("Navigation executed to /");
              }, 300);
              
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name="log-out-outline" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  }
});