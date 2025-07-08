
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { SuperAdminStoreManager } from './SuperAdminStoreManager';
import { POSApplication } from './POSApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Store, Users, Package, Loader2, AlertCircle } from 'lucide-react';

export const RoleBasedDashboard: React.FC = () => {
  const { userRole, signOut, loading, user } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no user at all, show access denied
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
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

  // If user is authenticated but no role, allow access with default permissions
  if (user && !userRole) {
    console.log('User authenticated but no role, showing default POS interface');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-orange-600" />
              <h1 className="text-xl font-bold">POS System</h1>
              <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                STAFF (DEFAULT)
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

  // Cashier/Staff Dashboard (including 'staff' role)
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
