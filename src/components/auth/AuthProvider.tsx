
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthStateListener } from '@/hooks/useAuthStateListener';
import { supabase } from '@/lib/supabase';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnvironmentValid, setIsEnvironmentValid] = useState(false);

  // Simple environment check - if supabase client exists, we're good
  useEffect(() => {
    const checkSupabaseConnection = () => {
      const isValid = !!supabase;
      console.log('Supabase connection check:', isValid ? 'Connected' : 'Not connected');
      setIsEnvironmentValid(isValid);
      
      if (isValid) {
        // Initialize auth state when Supabase is available
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('Initial session check:', session ? 'Session found' : 'No session');
          setUser(session?.user ?? null);
          setLoading(false);
        }).catch((error) => {
          console.error('Session check error:', error);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    };

    // Initial check
    checkSupabaseConnection();

    // Recheck every 2 seconds for the first 30 seconds if not connected
    let attempts = 0;
    const maxAttempts = 15;
    
    const intervalId = setInterval(() => {
      attempts++;
      if (!isEnvironmentValid && attempts < maxAttempts) {
        checkSupabaseConnection();
      } else {
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isEnvironmentValid]);

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
