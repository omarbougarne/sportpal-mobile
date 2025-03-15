import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '@/app/services/api/authApi';
import { fetchCurrentUser } from '@/app/services/api/userApi';
import { User } from '@/app/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call login API
      const response = await apiLogin({ email, password });
      
      // Store token
      await AsyncStorage.setItem('authToken', response.access_token || response.token);
      
      // Store user data if available
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        console.log('User data stored during login:', { id: response.user._id });
      } else {
        console.warn('No user data received from login API');
      }
      
      setIsAuthenticated(true);
      onAuthChange(true);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to login');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call signup API
      const response = await apiSignup(userData);
      
      if (response.success && !response.requiresLogin) {
        // If signup automatically logs in the user
        await AsyncStorage.setItem('authToken', response.access_token || response.token);
        
        // Store user data if available
        if (response.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.user));
          setUser(response.user);
          console.log('User data stored during signup:', { id: response.user._id });
        }
        
        setIsAuthenticated(true);
        onAuthChange(true);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API if needed
      await apiLogout();
      
      // Clear stored data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      setIsAuthenticated(false);
      setUser(null);
      onAuthChange(false);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err?.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

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

  // Log the current auth state
  console.log('useAuth returning:', { hasUser: !!user, userId: user?._id });

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
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
