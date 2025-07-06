
import { User } from '@supabase/supabase-js';
import { Attendant } from '@/types';

export interface AuthContextType {
  user: User | null;
  attendant: Attendant | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: string }>;
  isEnvironmentValid: boolean;
  // Enhanced RBAC and subscription properties
  userRole: 'super_admin' | 'owner' | 'admin' | 'manager' | 'staff' | null;
  tenantId: string | null;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial' | null;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise' | null;
  hasPermission: (permission: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  isSubscriptionActive: boolean;
}

export interface SignUpUserData {
  storeName?: string;
  ownerName?: string;
  phone?: string;
  currency?: string;
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageStores: boolean;
  canViewReports: boolean;
  canManageProducts: boolean;
  canProcessTransactions: boolean;
  canManageSettings: boolean;
  canAccessAnalytics: boolean;
  canManageSubscription: boolean;
}

export interface SubscriptionFeatures {
  multiStore: boolean;
  advancedReports: boolean;
  analytics: boolean;
  api: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
}
