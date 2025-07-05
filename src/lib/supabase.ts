
import { createClient } from '@supabase/supabase-js';

// Dynamic environment variable access
const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL || '';
const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseUrl = getSupabaseUrl();
let supabaseAnonKey = getSupabaseAnonKey();

// Enhanced validation with detailed logging
const logEnvironmentStatus = () => {
  console.log('=== Supabase Environment Status ===');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  console.log('URL length:', supabaseUrl.length);
  console.log('Key length:', supabaseAnonKey.length);
  console.log('====================================');
};

// Initial logging
logEnvironmentStatus();

// Validate environment variables with detailed feedback
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Supabase project settings');
  console.error('You can find these values in your Supabase Dashboard > Settings > API');
}

// Create Supabase client with enhanced error handling
const createSupabaseClient = () => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  
  if (!url || !key) {
    console.warn('Cannot create Supabase client: missing environment variables');
    return null;
  }

  try {
    return createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'msuper-pos@1.0.0'
        }
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Initialize client
export let supabase = createSupabaseClient();

// Function to refresh Supabase client (useful after environment variables are set)
export const refreshSupabaseClient = () => {
  console.log('Refreshing Supabase client...');
  supabaseUrl = getSupabaseUrl();
  supabaseAnonKey = getSupabaseAnonKey();
  logEnvironmentStatus();
  supabase = createSupabaseClient();
  return supabase;
};

// Security utility functions
export const logSecurityEvent = async (
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: any
) => {
  if (!supabase) {
    console.warn('Cannot log security event: Supabase not configured');
    return;
  }
  
  try {
    await supabase.rpc('log_security_event', {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Enhanced error handling that doesn't expose sensitive information
export const handleSupabaseError = (error: any, context: string) => {
  // Log the full error details for debugging (server-side only in production)
  console.error(`Supabase error in ${context}:`, error);
  
  // Log security events for authentication errors
  if (error?.message?.includes('Invalid login credentials') || 
      error?.message?.includes('Email not confirmed')) {
    logSecurityEvent('auth_failed', 'authentication', null, {
      context,
      timestamp: new Date().toISOString()
    });
  }
  
  // Return sanitized error messages for users
  let userMessage = 'An unexpected error occurred';
  
  if (error?.message?.includes('Invalid login credentials')) {
    userMessage = 'Invalid email or password';
  } else if (error?.message?.includes('Email not confirmed')) {
    userMessage = 'Please check your email and verify your account';
  } else if (error?.message?.includes('User already registered')) {
    userMessage = 'An account with this email already exists';
  } else if (error?.message?.includes('Password should be at least')) {
    userMessage = 'Password must be at least 6 characters long';
  } else if (error?.message?.includes('Unable to validate email address')) {
    userMessage = 'Please enter a valid email address';
  }
  
  return { error: userMessage };
};

// Rate limiting utility with enhanced security
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    // Log rate limit exceeded events
    logSecurityEvent('rate_limit_exceeded', 'security', identifier, {
      attempts: userRequests.count,
      windowMs,
      timestamp: new Date().toISOString()
    });
    return false;
  }
  
  userRequests.count++;
  return true;
};

// Dynamic environment validation utility
export const validateEnvironment = () => {
  const currentUrl = getSupabaseUrl();
  const currentKey = getSupabaseAnonKey();
  const issues = [];
  
  console.log('Validating environment variables...');
  console.log('Current URL exists:', !!currentUrl);
  console.log('Current Key exists:', !!currentKey);
  
  if (!currentUrl) {
    issues.push('VITE_SUPABASE_URL is not set');
  }
  
  if (!currentKey) {
    issues.push('VITE_SUPABASE_ANON_KEY is not set');
  }
  
  const isValid = issues.length === 0;
  console.log('Environment validation result:', isValid);
  
  return {
    isValid,
    issues
  };
};

// Secure session management
export const clearSecureSession = () => {
  if (typeof window !== 'undefined') {
    // Clear sensitive localStorage data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('pos_') || 
        key.includes('auth_') || 
        key.includes('session_') ||
        key.includes('supabase.')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage as well
    sessionStorage.clear();
  }
};
