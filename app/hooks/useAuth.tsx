// Add this at the end of your file, after the AuthProvider component

import React from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to easily access the auth context from any component
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};