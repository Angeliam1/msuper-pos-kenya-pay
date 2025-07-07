
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { SuperAdminStoreManager } from './SuperAdminStoreManager';
import { POSApplication } from './POSApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Store, Users, Package } from 'lucide-react';

export const RoleBasedDashboard: React.FC = () => {
  const { userRole, signOut } = useAuth();

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have the required permissions to access this page.</p>
            <Button onClick={signOut} className="mt-4">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Super Admin Dashboard
  if (userRole.role === 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
        <div className="p-6">
          <SuperAdminStoreManager />
        </div>
      </div>
    );
  }

  // Admin/Manager Dashboard
  if (['owner', 'admin', 'manager'].includes(userRole.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Store Management</h1>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {userRole.role.toUpperCase()}
              </span>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
        <div className="p-6">
          <POSApplication />
        </div>
      </div>
    );
  }

  // Cashier/Staff Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-600" />
            <h1 className="text-xl font-bold">POS System</h1>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {userRole.role.toUpperCase()}
            </span>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
      <div className="p-6">
        <POSApplication />
      </div>
    </div>
  );
};
