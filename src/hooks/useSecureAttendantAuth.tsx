
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils, SecureStorage } from '@/utils/security';
import { Attendant } from '@/types';

interface SessionData {
  attendantId: string;
  token: string;
  loginTime: string;
  expiresAt: string;
  attendant?: Attendant;
}

export const useSecureAttendantAuth = () => {
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);

  const authenticateAttendant = useCallback(async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; attendant?: Attendant; error?: string }> => {
    setLoading(true);

    try {
      // Rate limiting check
      const clientId = `attendant_auth_${email}`;
      if (!SecurityUtils.checkRateLimit(clientId, 5, 300000)) { // 5 attempts per 5 minutes
        await SecurityUtils.logSecurityEvent(
          'rate_limit_exceeded',
          'attendant_auth',
          email,
          { attempt_type: 'login' },
          'medium'
        );
        return { success: false, error: 'Too many login attempts. Please try again later.' };
      }

      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!SecurityUtils.validateEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Check if account is locked
      const { data: attendantData, error: fetchError } = await supabase
        .from('attendants')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (fetchError || !attendantData) {
        await SecurityUtils.logSecurityEvent(
          'failed_login_attempt',
          'attendant',
          email,
          { reason: 'user_not_found' },
          'medium'
        );
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if account is locked
      if (attendantData.locked_until && new Date(attendantData.locked_until) > new Date()) {
        setLockedUntil(new Date(attendantData.locked_until));
        await SecurityUtils.logSecurityEvent(
          'locked_account_access_attempt',
          'attendant',
          attendantData.id,
          { locked_until: attendantData.locked_until },
          'high'
        );
        return { 
          success: false, 
          error: `Account is locked until ${new Date(attendantData.locked_until).toLocaleString()}` 
        };
      }

      // Verify password using database function
      const { data: passwordValid, error: verifyError } = await supabase.rpc('verify_password', {
        p_password: password,
        p_hash: attendantData.password_hash
      });

      if (verifyError || !passwordValid) {
        // Increment failed attempts
        const newFailedAttempts = (attendantData.failed_attempts || 0) + 1;
        const shouldLock = newFailedAttempts >= 5;
        
        const updateData: any = {
          failed_attempts: newFailedAttempts,
          updated_at: new Date().toISOString()
        };

        if (shouldLock) {
          updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
        }

        await supabase
          .from('attendants')
          .update(updateData)
          .eq('id', attendantData.id);

        await SecurityUtils.logSecurityEvent(
          'failed_login_attempt',
          'attendant',
          attendantData.id,
          { 
            failed_attempts: newFailedAttempts,
            locked: shouldLock,
            reason: 'invalid_password'
          },
          shouldLock ? 'high' : 'medium'
        );

        if (shouldLock) {
          return { 
            success: false, 
            error: 'Account locked due to too many failed attempts. Please try again in 30 minutes.' 
          };
        }

        return { success: false, error: 'Invalid credentials' };
      }

      // Successful login - reset failed attempts and update last login
      await supabase
        .from('attendants')
        .update({
          failed_attempts: 0,
          locked_until: null,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', attendantData.id);

      // Store secure session
      const sessionToken = SecurityUtils.generateSecureToken();
      
      // Fix the role type assertion to match the expected union type
      const validRole = ['admin', 'cashier', 'manager', 'staff'].includes(attendantData.role) 
        ? attendantData.role as 'admin' | 'cashier' | 'manager' | 'staff'
        : 'staff' as const;

      const attendant: Attendant = {
        id: attendantData.id,
        name: attendantData.name,
        email: attendantData.email,
        phone: attendantData.phone,
        role: validRole,
        isActive: attendantData.is_active,
        createdAt: new Date(attendantData.created_at)
      };

      const sessionData: SessionData = {
        attendantId: attendantData.id,
        token: sessionToken,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        attendant
      };

      SecureStorage.setItem('attendant_session', sessionData);

      await SecurityUtils.logSecurityEvent(
        'successful_login',
        'attendant',
        attendantData.id,
        { login_method: 'password' },
        'info'
      );

      return { success: true, attendant };

    } catch (error) {
      console.error('Authentication error:', error);
      await SecurityUtils.logSecurityEvent(
        'authentication_error',
        'system',
        undefined,
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'high'
      );
      return { success: false, error: 'Authentication system error' };
    } finally {
      setLoading(false);
    }
  }, []);

  const createAttendant = useCallback(async (attendantData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }): Promise<{ success: boolean; attendant?: Attendant; error?: string }> => {
    setLoading(true);

    try {
      // Validate input data
      const validation = SecurityUtils.validateCustomerData({
        name: attendantData.name,
        email: attendantData.email,
        phone: attendantData.phone
      });

      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Validate password
      const passwordValidation = SecurityUtils.validatePassword(attendantData.password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      // Check if email already exists
      const { data: existingAttendant } = await supabase
        .from('attendants')
        .select('id')
        .eq('email', attendantData.email.toLowerCase())
        .single();

      if (existingAttendant) {
        return { success: false, error: 'An attendant with this email already exists' };
      }

      // Hash password using database function
      const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
        p_password: attendantData.password
      });

      if (hashError || !hashedPassword) {
        return { success: false, error: 'Failed to secure password' };
      }

      // Create attendant
      const { data: newAttendant, error: createError } = await supabase
        .from('attendants')
        .insert({
          name: validation.sanitized.name,
          email: validation.sanitized.email,
          phone: validation.sanitized.phone,
          password_hash: hashedPassword,
          role: attendantData.role || 'staff',
          is_active: true
        })
        .select()
        .single();

      if (createError || !newAttendant) {
        return { success: false, error: 'Failed to create attendant account' };
      }

      await SecurityUtils.logSecurityEvent(
        'attendant_created',
        'attendant',
        newAttendant.id,
        { created_by: 'system', role: attendantData.role || 'staff' },
        'info'
      );

      return {
        success: true,
        attendant: {
          id: newAttendant.id,
          name: newAttendant.name,
          email: newAttendant.email,
          phone: newAttendant.phone,
          role: newAttendant.role as 'admin' | 'cashier' | 'manager' | 'staff',
          isActive: newAttendant.is_active,
          createdAt: new Date(newAttendant.created_at)
        } as Attendant
      };

    } catch (error) {
      console.error('Attendant creation error:', error);
      return { success: false, error: 'Failed to create attendant account' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const session = SecureStorage.getItem<SessionData>('attendant_session');
    if (session?.attendantId) {
      await SecurityUtils.logSecurityEvent(
        'logout',
        'attendant',
        session.attendantId,
        { logout_method: 'manual' },
        'info'
      );
    }
    
    SecureStorage.removeItem('attendant_session');
    setLockedUntil(null);
  }, []);

  const checkSession = useCallback((): Attendant | null => {
    const session = SecureStorage.getItem<SessionData>('attendant_session');
    if (!session || new Date(session.expiresAt) < new Date()) {
      SecureStorage.removeItem('attendant_session');
      return null;
    }
    return session.attendant || null;
  }, []);

  return {
    authenticateAttendant,
    createAttendant,
    logout,
    checkSession,
    loading,
    lockedUntil
  };
};
