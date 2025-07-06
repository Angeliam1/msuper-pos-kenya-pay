
import { useState } from 'react';
import { supabase, logSecurityEvent } from '@/lib/supabase';
import { validateEmail, validateName, sanitizeInput } from '@/utils/security';

interface SecureAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);

  const passwordRequirements: PasswordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < passwordRequirements.minLength) {
      errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
    }

    if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { isValid: errors.length === 0, errors };
  };

  const secureSignIn = async (email: string, password: string): Promise<SecureAuthResult> => {
    setLoading(true);

    try {
      // Validate and sanitize inputs
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());
      
      if (!validateEmail(cleanEmail)) {
        return { success: false, error: 'Invalid email format' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        await logSecurityEvent('secure_signin_failed', 'authentication', null, {
          email: cleanEmail,
          error: error.message,
          timestamp: new Date().toISOString(),
          severity: 'high'
        });

        return { success: false, error: 'Invalid credentials' };
      }

      await logSecurityEvent('secure_signin_success', 'authentication', data.user?.id, {
        email: cleanEmail,
        timestamp: new Date().toISOString()
      });

      return { success: true, user: data.user };
    } catch (error) {
      await logSecurityEvent('secure_signin_error', 'authentication', null, {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });

      return { success: false, error: 'Authentication service unavailable' };
    } finally {
      setLoading(false);
    }
  };

  const secureSignUp = async (
    email: string, 
    password: string, 
    userData: { 
      storeName: string; 
      ownerName: string; 
      phone?: string; 
      currency?: string; 
    }
  ): Promise<SecureAuthResult> => {
    setLoading(true);

    try {
      // Validate and sanitize inputs
      const cleanEmail = sanitizeInput(email.toLowerCase().trim());
      const cleanStoreName = sanitizeInput(userData.storeName.trim());
      const cleanOwnerName = sanitizeInput(userData.ownerName.trim());

      if (!validateEmail(cleanEmail)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (!validateName(cleanStoreName) || cleanStoreName.length < 2) {
        return { success: false, error: 'Store name must be at least 2 characters and contain only letters, spaces, and basic punctuation' };
      }

      if (!validateName(cleanOwnerName) || cleanOwnerName.length < 2) {
        return { success: false, error: 'Owner name must be at least 2 characters and contain only letters, spaces, and basic punctuation' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join('. ') };
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            store_name: cleanStoreName,
            owner_name: cleanOwnerName,
            phone: userData.phone ? sanitizeInput(userData.phone.trim()) : undefined,
            currency: userData.currency || 'KES'
          }
        }
      });

      if (error) {
        await logSecurityEvent('secure_signup_failed', 'authentication', null, {
          email: cleanEmail,
          error: error.message,
          timestamp: new Date().toISOString(),
          severity: 'medium'
        });

        return { success: false, error: error.message };
      }

      await logSecurityEvent('secure_signup_success', 'authentication', data.user?.id, {
        email: cleanEmail,
        store_name: cleanStoreName,
        timestamp: new Date().toISOString()
      });

      return { success: true, user: data.user };
    } catch (error) {
      await logSecurityEvent('secure_signup_error', 'authentication', null, {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });

      return { success: false, error: 'Registration service unavailable' };
    } finally {
      setLoading(false);
    }
  };

  return {
    secureSignIn,
    secureSignUp,
    validatePassword,
    loading,
    passwordRequirements
  };
};
