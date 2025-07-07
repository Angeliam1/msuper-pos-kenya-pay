
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
