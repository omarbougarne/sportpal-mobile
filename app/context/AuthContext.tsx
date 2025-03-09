import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, signup as apiSignup } from '@/app/services/api/authApi';
import { User } from '@/app/types/user';

// Update the interface to include the user property
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;  // Add this property
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
  onAuthChange: (isAuthenticated: boolean) => void;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  user: null,  // Initialize as null
  loading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  clearError: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);  // Add state for user
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        
        if (token) {
          setIsAuthenticated(true);
          // Set the user if available
          if (userData) {
            setUser(JSON.parse(userData));
          }
          onAuthChange(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          onAuthChange(false);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fix: Pass a single object with email and password properties
      const { token, user } = await apiLogin({ email, password });
      await AsyncStorage.setItem('token', token);
      // Store user data in AsyncStorage as well
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);  // Set the user in state
      onAuthChange(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await apiSignup(userData);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);  // Set the user in state
      onAuthChange(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // If there's an apiLogout function, call it
      // await apiLogout();
      
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUser(null);  // Clear the user
      onAuthChange(false);
    } catch (err: any) {
      console.error('Logout error:', err);
      // Still clear local auth state even if API call fails
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUser(null);
      onAuthChange(false);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,  // Include user in the context value
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};