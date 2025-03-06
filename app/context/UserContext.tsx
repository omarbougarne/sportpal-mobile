// UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentUser } from '@/app/services/api/userApi';
import { User } from '@/app/types/user';

interface UserContextType {
  user: User | null;
  refreshUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  useEffect(() => {
    // Fetch the user data when the provider mounts.
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
