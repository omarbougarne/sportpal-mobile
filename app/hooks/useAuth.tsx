import { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

// In your useAuth.tsx:
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('useAuth returning:', { hasUser: !!context.user });
  return context;
}