
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
  const subscriptionStatus = 'active' as const;
  const subscriptionPlan = 'basic' as const;
  const isSubscriptionActive = true;
  const isEnvironmentValid = true;

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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
        setUserRole(null);
      } else if (data && data.length > 0) {
        // Type assertion to ensure the role field matches our expected type
        const roleData = data[0];
        const validRole = roleData.role as UserRole['role'];
        setUserRole({
          ...roleData,
          role: validRole
        } as UserRole);
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive"
        });
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive"
        });
        return { error: error.message };
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive"
      });
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
