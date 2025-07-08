
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Loader2, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'owner' | 'admin' | 'manager' | 'cashier' | 'staff';
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth' 
}) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">M-Super POS</span>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && (!userRole || userRole.role !== requiredRole)) {
    // Redirect based on actual role
    if (userRole?.role === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    } else if (['owner', 'admin', 'manager'].includes(userRole?.role || '')) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/pos" replace />;
    }
  }

  return <>{children}</>;
};
