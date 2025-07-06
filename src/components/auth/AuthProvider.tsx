
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useAuthStateListener } from '@/hooks/useAuthStateListener';
import { useSubscription } from '@/hooks/useSubscription';
import { validateEnvironment } from '@/lib/supabase';
import { getRolePermissions, checkFeatureAccess } from '@/utils/permissions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [attendant, setAttendant] = useState<Attendant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnvironmentValid] = useState(() => validateEnvironment().isValid);

  // Get subscription data - pass user to avoid circular dependency
  const {
    subscriptionStatus,
    subscriptionPlan,
    tenantId,
    userRole,
    isSubscriptionActive,
    loading: subscriptionLoading
  } = useSubscription(user);

  // Use the auth operations hook
  const { signIn, signUp, signOut, updateProfile } = useAuthOperations(
    user,
    isEnvironmentValid,
    setAttendant
  );

  // Use the auth state listener hook
  useAuthStateListener(
    user,
    setUser,
    setLoading,
    setAttendant,
    isEnvironmentValid
  );

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!user || !userRole) return false;
    
    // Super admins have all permissions
    if (userRole === 'super_admin') return true;
    
    const permissions = getRolePermissions(userRole);
    return permissions[permission as keyof typeof permissions] || false;
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!user) return false;
    
    // Super admins can access all features
    if (userRole === 'super_admin') return true;
    
    return checkFeatureAccess(feature, subscriptionPlan, subscriptionStatus);
  };

  const value: AuthContextType = {
    user,
    attendant,
    loading: loading || subscriptionLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isEnvironmentValid,
    // Enhanced RBAC properties
    userRole: userRole as AuthContextType['userRole'],
    tenantId,
    subscriptionStatus: subscriptionStatus as AuthContextType['subscriptionStatus'],
    subscriptionPlan: subscriptionPlan as AuthContextType['subscriptionPlan'],
    hasPermission,
    canAccessFeature,
    isSubscriptionActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
