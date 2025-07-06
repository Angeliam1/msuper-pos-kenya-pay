
import { UserPermissions, SubscriptionFeatures } from '@/types/auth';

export const getRolePermissions = (role: string | null): UserPermissions => {
  const defaultPermissions: UserPermissions = {
    canManageUsers: false,
    canManageStores: false,
    canViewReports: false,
    canManageProducts: false,
    canProcessTransactions: false,
    canManageSettings: false,
    canAccessAnalytics: false,
    canManageSubscription: false,
  };

  switch (role) {
    case 'super_admin':
      return {
        canManageUsers: true,
        canManageStores: true,
        canViewReports: true,
        canManageProducts: true,
        canProcessTransactions: true,
        canManageSettings: true,
        canAccessAnalytics: true,
        canManageSubscription: true,
      };

    case 'owner':
      return {
        canManageUsers: true,
        canManageStores: true,
        canViewReports: true,
        canManageProducts: true,
        canProcessTransactions: true,
        canManageSettings: true,
        canAccessAnalytics: true,
        canManageSubscription: true,
      };

    case 'admin':
      return {
        canManageUsers: true,
        canManageStores: false,
        canViewReports: true,
        canManageProducts: true,
        canProcessTransactions: true,
        canManageSettings: true,
        canAccessAnalytics: true,
        canManageSubscription: false,
      };

    case 'manager':
      return {
        canManageUsers: false,
        canManageStores: false,
        canViewReports: true,
        canManageProducts: true,
        canProcessTransactions: true,
        canManageSettings: false,
        canAccessAnalytics: false,
        canManageSubscription: false,
      };

    case 'staff':
      return {
        canManageUsers: false,
        canManageStores: false,
        canViewReports: false,
        canManageProducts: false,
        canProcessTransactions: true,
        canManageSettings: false,
        canAccessAnalytics: false,
        canManageSubscription: false,
      };

    default:
      return defaultPermissions;
  }
};

export const getSubscriptionFeatures = (plan: string | null): SubscriptionFeatures => {
  const defaultFeatures: SubscriptionFeatures = {
    multiStore: false,
    advancedReports: false,
    analytics: false,
    api: false,
    whiteLabel: false,
    prioritySupport: false,
    customIntegrations: false,
  };

  switch (plan) {
    case 'enterprise':
      return {
        multiStore: true,
        advancedReports: true,
        analytics: true,
        api: true,
        whiteLabel: true,
        prioritySupport: true,
        customIntegrations: true,
      };

    case 'premium':
      return {
        multiStore: true,
        advancedReports: true,
        analytics: true,
        api: true,
        whiteLabel: false,
        prioritySupport: true,
        customIntegrations: false,
      };

    case 'basic':
      return {
        multiStore: false,
        advancedReports: false,
        analytics: false,
        api: false,
        whiteLabel: false,
        prioritySupport: false,
        customIntegrations: false,
      };

    default:
      return defaultFeatures;
  }
};

export const checkFeatureAccess = (
  feature: string,
  subscriptionPlan: string | null,
  subscriptionStatus: string | null
): boolean => {
  // If subscription is not active, only allow basic features
  if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
    return ['transactions', 'basic_reports', 'inventory'].includes(feature);
  }

  const features = getSubscriptionFeatures(subscriptionPlan);
  
  switch (feature) {
    case 'multi_store':
      return features.multiStore;
    case 'advanced_reports':
      return features.advancedReports;
    case 'analytics':
      return features.analytics;
    case 'api_access':
      return features.api;
    case 'white_label':
      return features.whiteLabel;
    case 'priority_support':
      return features.prioritySupport;
    case 'custom_integrations':
      return features.customIntegrations;
    default:
      return true; // Basic features are always available
  }
};
