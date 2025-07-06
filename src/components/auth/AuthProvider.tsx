
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthStateListener } from '@/hooks/useAuthStateListener';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnvironmentValid] = useState(true);

  // Simple initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
        console.log('Auth initialized:', session ? 'User found' : 'No user');
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Use the auth operations hook
  const { signIn, signUp, signOut, updateProfile } = useAuthOperations(
    user,
    isEnvironmentValid,
    setAttendant
  );

  // Use the auth state listener hook
  useAuthStateListener(
    user,
    setUser,
    setLoading,
    setAttendant,
    isEnvironmentValid
  );

  const value: AuthContextType = {
    user,
    attendant,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isEnvironmentValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
