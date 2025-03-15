// UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { fetchCurrentUser } from '@/app/services/api/userApi';
import { User } from '@/app/types/user';

interface UserContextType {
  user: User | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to use the user context
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
  isAuthenticated?: boolean; // Pass from AuthProvider
}

export const UserProvider = ({ children, isAuthenticated }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user on mount or auth status change
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    } else {
      clearUser();
    }
  }, [isAuthenticated]);

  const refreshUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setUser(null);
    }
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
