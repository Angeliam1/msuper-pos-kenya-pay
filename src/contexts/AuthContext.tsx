
import React, { createContext, useContext } from 'react';

// Simple standalone auth context for demo
export interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default implementation for standalone mode
    return {
      user: { id: 'demo', email: 'demo@example.com' },
      loading: false,
      signIn: async () => ({ error: undefined }),
      signOut: async () => {},
    };
  }
  return context;
};
