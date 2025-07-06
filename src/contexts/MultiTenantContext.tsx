
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tenant {
  id: string;
  name: string;
  subdomain?: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'suspended' | 'trial';
  monthlyFee: number;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  gracePeriodEnds?: Date;
  daysOverdue: number;
  totalRevenue: number;
  maxStores: number;
  maxUsers: number;
  maxProducts: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'staff';
  isActive: boolean;
  createdAt: Date;
}

interface MultiTenantContextType {
  currentTenant: Tenant | null;
  userRole: string | null;
  tenants: Tenant[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  createTenant: (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  deactivateTenant: (tenantId: string) => Promise<void>;
  activateTenant: (tenantId: string) => Promise<void>;
  getCurrentTenantId: () => string | null;
  checkTenantLimits: (type: 'stores' | 'users' | 'products') => Promise<boolean>;
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export const useMultiTenant = () => {
  const context = useContext(MultiTenantContext);
  if (!context) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
};

export const MultiTenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Mock data for demonstration - in real implementation, this would come from Supabase
  useEffect(() => {
    const initializeTenantData = async () => {
      setIsLoading(true);
      
      // Simulate API call to fetch user's tenant information
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tenant data
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-1',
          name: 'Electronics Store Chain',
          subdomain: 'electronics',
          subscriptionPlan: 'premium',
          subscriptionStatus: 'active',
          monthlyFee: 59.99,
          lastPaymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          daysOverdue: 0,
          totalRevenue: 15000,
          maxStores: 5,
          maxUsers: 20,
          maxProducts: 5000,
          features: { analytics: true, multiStore: true, advancedReports: true },
          isActive: true,
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          id: 'tenant-2',
          name: 'Local Grocery Store',
          subdomain: 'grocery',
          subscriptionPlan: 'basic',
          subscriptionStatus: 'past_due',
          monthlyFee: 29.99,
          lastPaymentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          nextBillingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          gracePeriodEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          daysOverdue: 15,
          totalRevenue: 890,
          maxStores: 1,
          maxUsers: 5,
          maxProducts: 1000,
          features: { analytics: false, multiStore: false, advancedReports: false },
          isActive: true,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ];
      
      setTenants(mockTenants);
      setCurrentTenant(mockTenants[0]);
      setUserRole('owner');
      setIsSuperAdmin(false); // Set to true for super admin testing
      setIsLoading(false);
    };

    initializeTenantData();
  }, []);

  const switchTenant = async (tenantId: string): Promise<void> => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // In real implementation, this would update the user's session
      localStorage.setItem('currentTenantId', tenantId);
    }
  };

  const createTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTenants(prev => [...prev, newTenant]);
    return newTenant.id;
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>): Promise<void> => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, ...updates, updatedAt: new Date() }
        : tenant
    ));
    
    if (currentTenant?.id === tenantId) {
      setCurrentTenant(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deactivateTenant = async (tenantId: string): Promise<void> => {
    await updateTenant(tenantId, { 
      isActive: false, 
      subscriptionStatus: 'suspended' 
    });
  };

  const activateTenant = async (tenantId: string): Promise<void> => {
    await updateTenant(tenantId, { 
      isActive: true, 
      subscriptionStatus: 'active',
      daysOverdue: 0
    });
  };

  const getCurrentTenantId = (): string | null => {
    return currentTenant?.id || null;
  };

  const checkTenantLimits = async (type: 'stores' | 'users' | 'products'): Promise<boolean> => {
    if (!currentTenant) return false;
    
    // In real implementation, this would query the database for current usage
    const limits = {
      stores: currentTenant.maxStores,
      users: currentTenant.maxUsers,
      products: currentTenant.maxProducts
    };
    
    // Mock current usage - in real implementation, fetch from database
    const currentUsage = {
      stores: 2,
      users: 8,
      products: 450
    };
    
    return currentUsage[type] < limits[type];
  };

  return (
    <MultiTenantContext.Provider value={{
      currentTenant,
      userRole,
      tenants,
      isLoading,
      isSuperAdmin,
      switchTenant,
      createTenant,
      updateTenant,
      deactivateTenant,
      activateTenant,
      getCurrentTenantId,
      checkTenantLimits
    }}>
      {children}
    </MultiTenantContext.Provider>
  );
};
