
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, logSecurityEvent, handleSupabaseError, checkRateLimit, validateEnvironment, clearSecureSession } from '@/lib/supabase';
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
  isEnvironmentValid: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnvironmentValid, setIsEnvironmentValid] = useState(false);

  useEffect(() => {
    // Validate environment configuration
    const envValidation = validateEnvironment();
    setIsEnvironmentValid(envValidation.isValid);
    
    if (!envValidation.isValid) {
      console.error('Environment validation failed:', envValidation.issues);
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
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    if (!supabase || !isEnvironmentValid) {
      return { error: 'Authentication service not available. Please check your configuration.' };
    }

    // Enhanced rate limiting with email-based tracking
    const rateLimitKey = `signin_${email.toLowerCase()}`;
    if (!checkRateLimit(rateLimitKey, 5, 300000)) { // 5 attempts per 5 minutes
      logSecurityEvent('rate_limit_exceeded', 'authentication', null, { 
        email, 
        action: 'signin',
        severity: 'high'
      });
      return { error: 'Too many login attempts. Please try again in 5 minutes.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      
      if (error) {
        // Log failed signin with severity based on error type
        const severity = error.message.includes('Invalid login credentials') ? 'high' : 'medium';
        logSecurityEvent('signin_failed', 'authentication', null, { 
          email: email.toLowerCase(),
          error: error.message,
          timestamp: new Date().toISOString()
        }, severity);
        
        return handleSupabaseError(error, 'signIn');
      }
      
      // Log successful signin
      logSecurityEvent('signin_success', 'authentication', data.user?.id, { 
        email: email.toLowerCase(),
        timestamp: new Date().toISOString()
      });
      
      return {};
    } catch (error) {
      logSecurityEvent('signin_error', 'authentication', null, {
        email: email.toLowerCase(),
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 'critical');
      
      return handleSupabaseError(error, 'signIn');
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!supabase || !isEnvironmentValid) {
      return { error: 'Authentication service not available. Please check your configuration.' };
    }

    // Enhanced rate limiting for signup
    const rateLimitKey = `signup_${email.toLowerCase()}`;
    if (!checkRateLimit(rateLimitKey, 3, 3600000)) { // 3 attempts per hour
      logSecurityEvent('rate_limit_exceeded', 'authentication', null, { 
        email: email.toLowerCase(), 
        action: 'signup',
        severity: 'high'
      });
      return { error: 'Too many registration attempts. Please try again in 1 hour.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            store_name: userData.storeName?.trim(),
            phone: userData.phone?.trim(),
            currency: userData.currency || 'KES',
            owner_name: userData.ownerName?.trim(),
          }
        }
      });
      
      if (error) {
        logSecurityEvent('signup_failed', 'authentication', null, { 
          email: email.toLowerCase(),
          error: error.message,
          timestamp: new Date().toISOString()
        }, 'medium');
        
        return handleSupabaseError(error, 'signUp');
      }
      
      // Log successful signup
      logSecurityEvent('signup_success', 'authentication', data.user?.id, { 
        email: email.toLowerCase(),
        store_name: userData.storeName,
        timestamp: new Date().toISOString()
      });
      
      return {};
    } catch (error) {
      logSecurityEvent('signup_error', 'authentication', null, {
        email: email.toLowerCase(),
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 'critical');
      
      return handleSupabaseError(error, 'signUp');
    }
  };

  const signOut = async () => {
    if (!supabase) return;

    try {
      const userId = user?.id;
      
      // Clear sensitive data before signing out
      setAttendant(null);
      clearSecureSession();
      
      await supabase.auth.signOut();
      
      logSecurityEvent('signout_success', 'authentication', userId, {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Sign out error:', error);
      logSecurityEvent('signout_error', 'authentication', user?.id, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 'medium');
    }
  };

  const updateProfile = async (updates: any) => {
    if (!supabase || !isEnvironmentValid) {
      return { error: 'Authentication service not available. Please check your configuration.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        logSecurityEvent('profile_update_failed', 'user_profile', user?.id, { 
          error: error.message,
          timestamp: new Date().toISOString()
        }, 'medium');
        
        return handleSupabaseError(error, 'updateProfile');
      }
      
      logSecurityEvent('profile_updated', 'user_profile', user?.id, {
        updated_fields: Object.keys(updates),
        timestamp: new Date().toISOString()
      });
      
      return {};
    } catch (error) {
      logSecurityEvent('profile_update_error', 'user_profile', user?.id, {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 'medium');
      
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
    isEnvironmentValid,
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
