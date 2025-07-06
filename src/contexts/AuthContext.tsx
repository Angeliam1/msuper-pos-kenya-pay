
import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';

export interface AuthContextType {
  user: User | null;
  attendant: Attendant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
  isEnvironmentValid: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
