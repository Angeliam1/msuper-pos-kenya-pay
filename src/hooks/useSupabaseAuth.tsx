
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserRole {
  id: string;
  user_id: string;
  store_id: string | null;
  tenant_id: string | null;
  role: 'super_admin' | 'owner' | 'admin' | 'manager' | 'cashier' | 'staff';
  is_active: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock subscription data for now - can be enhanced later
  const subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial' = 'active';
  const subscriptionPlan: 'basic' | 'premium' | 'enterprise' = 'basic';
  const isSubscriptionActive = true;
  const isEnvironmentValid = true;

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No user');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found, fetching role...');
            await fetchUserRole(session.user.id);
          } else {
            console.log('No user found, setting loading to false');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching role...');
          await fetchUserRole(session.user.id);
        } else {
          console.log('User signed out, clearing role');
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user role:', error);
        // Even if role fetch fails, we should still allow the user to proceed
        setUserRole(null);
      } else if (data && data.length > 0) {
        console.log('User role found:', data[0]);
        const roleData = data[0];
        const validRole = roleData.role as UserRole['role'];
        setUserRole({
          ...roleData,
          role: validRole
        } as UserRole);
      } else {
        console.log('No user role found, user may need to complete setup');
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    } finally {
      console.log('Setting loading to false after role fetch');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error: error.message };
      }

      console.log('Sign in successful');
      // Don't set loading to false here - let the auth state change handle it
      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Sign in error:', errorMessage);
      setLoading(false);
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setLoading(false);
        return { error: error.message };
      }

      console.log('Sign up successful');
      // Don't set loading to false here - let the email confirmation flow handle it
      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Sign up error:', errorMessage);
      setLoading(false);
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    
    // Super admins have all permissions
    if (userRole.role === 'super_admin') return true;
    
    // Define role permissions
    const permissions = {
      super_admin: ['all'],
      owner: ['store_management', 'user_management', 'pos', 'reports', 'settings'],
      admin: ['user_management', 'pos', 'reports', 'settings'],
      manager: ['pos', 'reports', 'settings'],
      cashier: ['pos'],
      staff: ['pos']
    };
    
    const rolePermissions = permissions[userRole.role] || [];
    return rolePermissions.includes('all') || rolePermissions.includes(permission);
  };

  const canAccessFeature = (feature: string): boolean => {
    // Basic feature access - can be enhanced later with actual subscription logic
    return true;
  };

  return {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    canAccessFeature,
    subscriptionStatus,
    subscriptionPlan,
    isSubscriptionActive,
    isEnvironmentValid
  };
};
