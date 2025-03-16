import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, login, logout, signup } from '@/app/services/api/authApi';
import { fetchCurrentUser } from '@/app/services/api/userApi';
import { User } from '@/app/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (loginData: { email: string; password: string }) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
  // Contract related helpers
  isTrainer: boolean;
  canHireTrainers: boolean;
  canManageContracts: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  clearError: () => {},
  refreshUserData: async () => {},
  // Default contract capabilities
  isTrainer: false,
  canHireTrainers: false,
  canManageContracts: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onAuthChange = () => {} }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        
        if (token) {
          // Get minimal user data from backend using the token
          const userData = await fetchCurrentUser();
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            onAuthChange(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
            onAuthChange(false);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          onAuthChange(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setIsAuthenticated(false);
        setUser(null);
        onAuthChange(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [onAuthChange]);

  // Existing functions like login, signup, logout...

  const clearError = () => {
    setError(null);
  };
  
  const refreshUserData = async () => {
    if (!user || !user._id) return;
    
    try {
      setLoading(true);
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        console.log('User data refreshed successfully');
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived properties for contract capabilities
  const isTrainer = Boolean(user?.trainerProfile);
  const canHireTrainers = isAuthenticated && !isTrainer;
  const canManageContracts = isAuthenticated;

  // Log the current auth state
  console.log('useAuth returning:', { 
    hasUser: !!user, 
    userId: user?._id,
    isTrainer,
    canHireTrainers
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        refreshUserData,
        // Contract related helpers
        isTrainer,
        canHireTrainers,
        canManageContracts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};