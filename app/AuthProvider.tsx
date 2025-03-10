// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { login as apiLogin, signup as apiSignup, getStoredUser } from './services/api/authApi';
// import { User } from './types/user';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   user: null,
//   loading: false,
//   error: null,
//   login: async () => {},
//   signup: async () => {},
//   logout: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadAuthState = async () => {
//       try {
//         const [token, userData] = await Promise.all([
//           AsyncStorage.getItem('authToken'),
//           getStoredUser()
//         ]);

//         if (token && userData) {
//           setUser(userData);
//         }
//       } catch (error) {
//         console.error('Error loading auth state:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAuthState();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const user = await apiLogin({ email, password });
//       setUser(user);
//       setError(null);
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Login failed');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (name: string, email: string, password: string) => {
//     setLoading(true);
//     try {
//       const user = await apiSignup({ name, email, password });
//       setUser(user);
//       setError(null);
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Signup failed');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         AsyncStorage.removeItem('authToken'),
//         AsyncStorage.removeItem('user')
//       ]);
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated: !!user,
//         user,
//         loading,
//         error,
//         login,
//         signup,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;