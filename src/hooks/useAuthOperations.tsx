
import { supabase, logSecurityEvent, handleSupabaseError, checkRateLimit, clearSecureSession } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { SignUpUserData } from '@/types/auth';

export const useAuthOperations = (
  user: User | null,
  isEnvironmentValid: boolean,
  setAttendant: (attendant: any) => void
) => {
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
        logSecurityEvent('signin_failed', 'authentication', null, { 
          email: email.toLowerCase(),
          error: error.message,
          timestamp: new Date().toISOString(),
          severity: error.message.includes('Invalid login credentials') ? 'high' : 'medium'
        });
        
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
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });
      
      return handleSupabaseError(error, 'signIn');
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
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
          timestamp: new Date().toISOString(),
          severity: 'medium'
        });
        
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
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });
      
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
        timestamp: new Date().toISOString(),
        severity: 'medium'
      });
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
          timestamp: new Date().toISOString(),
          severity: 'medium'
        });
        
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
        timestamp: new Date().toISOString(),
        severity: 'medium'
      });
      
      return handleSupabaseError(error, 'updateProfile');
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile
  };
};
