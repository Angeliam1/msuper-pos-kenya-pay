
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthStateListener } from '@/hooks/useAuthStateListener';
import { validateEnvironment, refreshSupabaseClient } from '@/lib/supabase';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnvironmentValid, setIsEnvironmentValid] = useState(false);

  // Check environment validity on mount and periodically
  useEffect(() => {
    const checkEnvironment = () => {
      const validation = validateEnvironment();
      console.log('Environment check result:', validation);
      
      if (validation.isValid && !isEnvironmentValid) {
        // Environment became valid, refresh Supabase client
        console.log('Environment became valid, refreshing Supabase client...');
        refreshSupabaseClient();
      }
      
      setIsEnvironmentValid(validation.isValid);
      return validation.isValid;
    };

    // Initial check
    checkEnvironment();

    // Periodic check every 2 seconds for the first 30 seconds
    let checkCount = 0;
    const maxChecks = 15; // 30 seconds total
    
    const intervalId = setInterval(() => {
      checkCount++;
      const isValid = checkEnvironment();
      
      // Stop checking if environment is valid or we've reached max checks
      if (isValid || checkCount >= maxChecks) {
        clearInterval(intervalId);
        console.log('Stopped environment validation checks');
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
