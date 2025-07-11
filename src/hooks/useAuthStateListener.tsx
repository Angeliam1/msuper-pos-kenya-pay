
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
    if (!isEnvironmentValid) {
      console.error('Environment validation failed');
      setLoading(false);
      return;
    }

    if (!supabase) {
      console.error('Supabase not configured properly');
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        logSecurityEvent('session_error', 'authentication', null, { 
          error: error.message,
          severity: 'high'
        });
      }
      
      setUser(session?.user ?? null);
      setLoading(false);

      // Log successful session restoration
      if (session?.user) {
        logSecurityEvent('session_restored', 'authentication', session.user.id);
      }
    });

    // Listen for auth changes with enhanced logging
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Enhanced authentication event logging
        switch (event) {
          case 'SIGNED_IN':
            logSecurityEvent('user_signed_in', 'authentication', session?.user?.id, {
              method: 'password',
              timestamp: new Date().toISOString()
            });
            break;
            
          case 'SIGNED_OUT':
            logSecurityEvent('user_signed_out', 'authentication', user?.id, {
              timestamp: new Date().toISOString()
            });
            setAttendant(null);
            clearSecureSession();
            break;
            
          case 'TOKEN_REFRESHED':
            logSecurityEvent('token_refreshed', 'authentication', session?.user?.id);
            break;
            
          case 'USER_UPDATED':
            logSecurityEvent('user_updated', 'authentication', session?.user?.id);
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [user?.id, isEnvironmentValid, setUser, setLoading, setAttendant]);
};
