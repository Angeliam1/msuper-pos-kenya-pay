
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { SuperAdminStoreManager } from './SuperAdminStoreManager';
import { POSApplication } from './POSApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Store, Package, Loader2 } from 'lucide-react';

export const RoleBasedDashboard: React.FC = () => {
  const { userRole, signOut, loading, user } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Loading M-Super POS</h3>
            <p className="text-gray-600">Please wait while we set up your workspace...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              M-Super POS
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please sign in to access the POS system</p>
            <Button onClick={() => window.location.href = '/auth'} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Super Admin Dashboard
  if (userRole?.role === 'super_admin') {
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
  if (userRole && ['owner', 'admin', 'manager'].includes(userRole.role)) {
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

  // Default POS Dashboard (for staff and others)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-600" />
            <h1 className="text-xl font-bold">M-Super POS</h1>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {userRole?.role.toUpperCase() || 'STAFF'}
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
