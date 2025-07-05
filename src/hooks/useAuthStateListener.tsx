
import { useEffect } from 'react';
import { supabase, logSecurityEvent, clearSecureSession } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuthStateListener = (
  user: User | null,
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
  setAttendant: (attendant: any) => void,
  isEnvironmentValid: boolean
) => {
  useEffect(() => {
    console.log('Setting up authentication listener...');

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'with session' : 'without session');
        setUser(session?.user ?? null);
        setLoading(false);
        
        switch (event) {
          case 'SIGNED_IN':
            logSecurityEvent('user_signed_in', 'authentication', session?.user?.id);
            break;
            
          case 'SIGNED_OUT':
            logSecurityEvent('user_signed_out', 'authentication', user?.id);
            setAttendant(null);
            clearSecureSession();
            break;
            
          case 'TOKEN_REFRESHED':
            logSecurityEvent('token_refreshed', 'authentication', session?.user?.id);
            break;
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [user?.id, setUser, setLoading, setAttendant]);
};
