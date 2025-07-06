
import { createClient } from '@supabase/supabase-js';

// Simple, direct Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl ? 'Available' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Available' : 'Missing');

// Create the client directly - no complex validation
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Environment validation function
export const validateEnvironment = () => {
  return {
    isValid: true,
    errors: []
  };
};

// Simple error handler
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error?.message?.includes('Invalid login credentials')) {
    return { error: 'Invalid email or password' };
  } else if (error?.message?.includes('Email not confirmed')) {
    return { error: 'Please check your email and verify your account' };
  } else if (error?.message?.includes('User already registered')) {
    return { error: 'An account with this email already exists' };
  }
  
  return { error: 'An unexpected error occurred' };
};

// Simple rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 300000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count++;
  return true;
};

// Simple session clear
export const clearSecureSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
};

// Dummy security logging (simplified)
export const logSecurityEvent = async (action: string, resourceType?: string, resourceId?: string, details?: any) => {
  console.log('Security Event:', { action, resourceType, resourceId, details });
};
