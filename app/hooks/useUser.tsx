import { useContext } from 'react';
import { UserContext } from '@/app/context/UserContext';

export function useUser() {
  try {
    const context = useContext(UserContext);
    
    if (context === undefined) {
      // Return default values instead of throwing
      return { 
        user: null,
        refreshUser: async () => {},
        clearUser: () => {}
      };
    }
    
    return context;
  } catch (e) {
    console.warn("Error using UserContext:", e);
    // Return safe defaults
    return { 
      user: null,
      refreshUser: async () => {},
      clearUser: () => {}
    };
  }
}