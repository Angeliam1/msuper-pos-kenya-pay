
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, logSecurityEvent, handleSupabaseError, checkRateLimit } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';

interface AuthContextType {
  user: User | null;
  attendant: Attendant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase not configured');
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        logSecurityEvent('session_error', 'authentication', null, { error: error.message });
      }
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log authentication events
        if (event === 'SIGNED_IN') {
          logSecurityEvent('user_signed_in', 'authentication', session?.user?.id);
        } else if (event === 'SIGNED_OUT') {
          logSecurityEvent('user_signed_out', 'authentication', session?.user?.id);
          setAttendant(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }

    // Rate limiting
    if (!checkRateLimit(`signin_${email}`, 5, 300000)) { // 5 attempts per 5 minutes
      logSecurityEvent('rate_limit_exceeded', 'authentication', null, { email, action: 'signin' });
      return { error: 'Too many login attempts. Please try again later.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logSecurityEvent('signin_failed', 'authentication', null, { 
          email, 
          error: error.message 
        });
        return handleSupabaseError(error, 'signIn');
      }
      
      logSecurityEvent('signin_success', 'authentication', null, { email });
      return {};
    } catch (error) {
      return handleSupabaseError(error, 'signIn');
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }

    // Rate limiting
    if (!checkRateLimit(`signup_${email}`, 3, 3600000)) { // 3 attempts per hour
      logSecurityEvent('rate_limit_exceeded', 'authentication', null, { email, action: 'signup' });
      return { error: 'Too many registration attempts. Please try again later.' };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            store_name: userData.storeName,
            phone: userData.phone,
            currency: userData.currency,
            owner_name: userData.ownerName,
          }
        }
      });
      
      if (error) {
        logSecurityEvent('signup_failed', 'authentication', null, { 
          email, 
          error: error.message 
        });
        return handleSupabaseError(error, 'signUp');
      }
      
      logSecurityEvent('signup_success', 'authentication', null, { email });
      return {};
    } catch (error) {
      return handleSupabaseError(error, 'signUp');
    }
  };

  const signOut = async () => {
    if (!supabase) return;

    try {
      const userId = user?.id;
      await supabase.auth.signOut();
      
      // Clear sensitive data
      setAttendant(null);
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        // Clear any sensitive localStorage data
        Object.keys(localStorage).forEach(key => {
          if (key.includes('pos_') || key.includes('auth_') || key.includes('session_')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      logSecurityEvent('signout_success', 'authentication', userId);
    } catch (error) {
      console.error('Sign out error:', error);
      logSecurityEvent('signout_error', 'authentication', user?.id, { error });
    }
  };

  const updateProfile = async (updates: any) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        logSecurityEvent('profile_update_failed', 'user_profile', user?.id, { error: error.message });
        return handleSupabaseError(error, 'updateProfile');
      }
      
      logSecurityEvent('profile_updated', 'user_profile', user?.id);
      return {};
    } catch (error) {
      return handleSupabaseError(error, 'updateProfile');
    }
  };

  const value = {
    user,
    attendant,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
