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

  // Mock subscription data for now
  const subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial' = 'active';
  const subscriptionPlan: 'basic' | 'premium' | 'enterprise' = 'basic';
  const isSubscriptionActive = true;
  const isEnvironmentValid = true;

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Set a default role immediately to prevent blocking
            const defaultRole: UserRole = {
              id: 'temp',
              user_id: session.user.id,
              store_id: null,
              tenant_id: null,
              role: 'staff',
              is_active: true
            };
            setUserRole(defaultRole);
            setLoading(false);
            
            // Try to fetch actual role in background
            fetchUserRole(session.user.id);
          } else {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Set default role immediately
          const defaultRole: UserRole = {
            id: 'temp',
            user_id: session.user.id,
            store_id: null,
            tenant_id: null,
            role: 'staff',
            is_active: true
          };
          setUserRole(defaultRole);
          setLoading(false);
          
          // Fetch actual role in background
          fetchUserRole(session.user.id);
        } else {
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
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data && data.length > 0) {
        setUserRole(data[0] as UserRole);
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Keep the default role if fetch fails
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoading(false);
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
    
    if (userRole.role === 'super_admin') return true;
    
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
